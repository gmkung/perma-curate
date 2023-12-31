import request, { gql } from 'graphql-request'
import { Prop, Request } from './fetchItems'

export interface GraphEvidence {
  party: string
  title: string | null
  description: string | null
  URI: string
  fileURI: string | null
  number: string
  timestamp: string
  txHash: string
  fileTypeExtension: string | null
}

export interface EvidenceGroup {
  id: string
  evidences: GraphEvidence[]
}

export interface RequestDetails extends Request {
  requestType: string
  arbitrator: string
  arbitratorExtraData: string
  creationTx: string
  resolutionTx: string
  disputeOutcome: string
  evidenceGroup: EvidenceGroup
}

export interface GraphItemDetails {
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
  key0: string
  key1: string
  key2: string
  key3: string
  props: Prop[]
  requests: RequestDetails[]
}

export const fetchItemDetails = async (
  itemId: string 
): Promise<GraphItemDetails> => {
  const query = gql`
    query ($id: String!) {
      litem(id: $id) {
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
        itemID
        registryAddress
        status
        disputed
        requests(orderBy: submissionTime, orderDirection: desc) {
          requestType
          disputed
          disputeID
          submissionTime
          resolved
          requester
          arbitrator
          arbitratorExtraData
          challenger
          creationTx
          resolutionTx
          deposit
          disputeOutcome
          resolutionTime
          evidenceGroup {
            id
            evidences(orderBy: number, orderDirection: desc) {
              party
              title
              description
              URI
              fileURI
              number
              timestamp
              txHash
              fileTypeExtension
            }
          }
          rounds(orderBy: creationTime, orderDirection: desc) {
            appealed
            appealPeriodStart
            appealPeriodEnd
            ruling
            hasPaidRequester
            hasPaidChallenger
            amountPaidRequester
            amountPaidChallenger
            txHashAppealPossible
            appealedAt
            txHashAppealDecision
          }
        }
      }
    }
  `
  const result = (await request({
    url: 'https://api.thegraph.com/subgraphs/name/kleros/legacy-curate-xdai',
    document: query,
    variables: {
      id: itemId,
    },
  })) as any

  return result.litem
}
