import { gql, request } from 'graphql-request'
import { ITEMS_PER_PAGE } from 'pages/Home'

export const registryMap = {
  Tags: '0x66260c69d03837016d88c9877e61e08ef74c59f2',
  CDN: '0x957a53a994860be4750810131d9c876b2f52d6e1',
  Tokens: '0xee1502e29795ef6c2d60f8d7120596abe3bad990',
}

export interface GraphItem {
  id: string
  latestRequestSubmissionTime: string
  registryAddress: string
  itemID: string
  status:
    | 'Registered'
    | 'Absent'
    | 'RegistrationRequested'
    | 'ClearingRequested'
  disputed: boolean
  data: string
  key0: string
  key1: string
  key2: string
  key3: string
  props: Prop[]
  requests: Request[]
}

export interface Prop {
  value: string
  type: string
  label: string
  description: string
  isIdentifier: boolean
}

export interface Request {
  disputed: boolean
  disputeID: string
  submissionTime: string
  resolved: boolean
  requester: string
  challenger: string
  resolutionTime: string
  deposit: string
  rounds: Round[]
}

export interface Round {
  appealPeriodStart: string
  appealPeriodEnd: string
  ruling: string
  hasPaidRequester: boolean
  hasPaidChallenger: boolean
  amountPaidRequester: string
  amountPaidChallenger: string
}

export const fetchItems = async (
  searchParams: URLSearchParams
): Promise<GraphItem[]> => {
  const registry = searchParams.getAll('registry')
  const status = searchParams.getAll('status')
  const disputed = searchParams.getAll('disputed')
  const network = searchParams.getAll('network')
  const text = searchParams.get('text')
  const orderDirection = searchParams.get('orderDirection')
  const page = Number(searchParams.get('page')) // page null casts to 0
  if (
    registry.length === 0 ||
    status.length === 0 ||
    disputed.length === 0 ||
    network.length === 0 ||
    page === 0
  ) {
    // This query is invalid, defaults haven't come yet.
    return []
  }

  const networkQueryObject = `{or: [${network
    .map((chainId) => `{key0_starts_with_nocase: "eip155:${chainId}:"}`)
    .join(',')}]},`

  // todo rethink the "lastId" thing? remove it?
  // because as it is rn, moving pages in a complex search involving > 1000 items
  // is going to suck and maybe even break the search!

  // yea I think fuck it. lets do the following
  // query 21 items, enough to be able to go up a page and check if there's more
  // show ? total items if you get 21 items out of the buffer.
  // use deduction to figure out how many items if <21 on current query (counting all previous 20 sized pages.)
  // that way is fast, you dont get total number but idc.
  // the main numbers we care about anyway are the "total" numbers, the main counts.

  const query = gql`
    query (
      $registry: [String!]!
      $status: [String!]!
      $disputed: [Boolean!]!
      $text: String!
      $skip: Int!
      $first: Int!
      $orderDirection: OrderDirection!
    ) {
      litems(
        where: {
          and: [
            {registry_in: $registry},
            {status_in: $status},
            {disputed_in: $disputed},
            # network section, dynamically generated.
            # only use if needed
            ${network.length === 4 ? '' : networkQueryObject}
            # filtering
            {or: [
              {key0_contains_nocase: $text},
              {key1_contains_nocase: $text},
              {key2_contains_nocase: $text},
              {key3_contains_nocase: $text},
            ]}]
        }
        skip: $skip
        first: $first
        orderBy: "latestRequestSubmissionTime"
        orderDirection: $orderDirection
      ) {
        id
        latestRequestSubmissionTime
        registryAddress
        itemID
        status
        disputed
        data
        key0
        key1
        key2
        key3
        props {
          value
          type
          label
          description
          isIdentifier
        }
        requests(first: 1, orderBy: submissionTime, orderDirection: desc) {
          disputed
          disputeID
          submissionTime
          resolved
          requester
          challenger
          resolutionTime
          deposit
          rounds(first: 1, orderBy: creationTime, orderDirection: desc) {
            appealPeriodStart
            appealPeriodEnd
            ruling
            hasPaidRequester
            hasPaidChallenger
            amountPaidRequester
            amountPaidChallenger
          }
        }
      }
    }
  `

  const result = (await request({
    url: 'https://api.thegraph.com/subgraphs/name/kleros/legacy-curate-xdai',
    document: query,
    variables: {
      registry: registry.map((r) => registryMap[r]),
      status,
      disputed: disputed.map((e) => e === 'true'),
      text: text || '',
      skip: (page - 1) * ITEMS_PER_PAGE,
      first: ITEMS_PER_PAGE + 1,
      orderDirection,
    },
  })) as any
  const items = result.litems
  return items
}
