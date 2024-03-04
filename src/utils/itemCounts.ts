import { gql, request } from 'graphql-request'
import { DepositParams, fetchRegistryDeposits } from './fetchRegistryDeposits'

export interface RegistryMetadata {
  address: string
  tcrTitle: string
  tcrDescription: string
  policyURI: string
  logoURI: string
}

export interface FocusedRegistry {
  numberOfAbsent: number
  numberOfRegistered: number
  numberOfClearingRequested: number
  numberOfChallengedClearing: number
  numberOfRegistrationRequested: number
  numberOfChallengedRegistrations: number
  metadata: RegistryMetadata
  deposits: DepositParams
}

export interface ItemCounts {
  Tags: FocusedRegistry
  CDN: FocusedRegistry
  Tokens: FocusedRegistry
}

const convertStringFieldsToNumber = (obj: any): any => {
  let result: any = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = convertStringFieldsToNumber(obj[key])
    } else if (typeof obj[key] === 'string') {
      result[key] = Number(obj[key])
    } else {
      result[key] = obj[key]
    }
  }

  return result
}

export const fetchItemCounts = async (): Promise<ItemCounts> => {
  const query = gql`
    {
      Tags: lregistry(id: "0x66260c69d03837016d88c9877e61e08ef74c59f2") {
        id
        numberOfAbsent
        numberOfRegistered
        numberOfClearingRequested
        numberOfChallengedClearing
        numberOfRegistrationRequested
        numberOfChallengedRegistrations
        registrationMetaEvidence {
          URI
        }
      }
      CDN: lregistry(id: "0x957a53a994860be4750810131d9c876b2f52d6e1") {
        id
        numberOfAbsent
        numberOfRegistered
        numberOfClearingRequested
        numberOfChallengedClearing
        numberOfRegistrationRequested
        numberOfChallengedRegistrations
        registrationMetaEvidence {
          URI
        }
      }
      Tokens: lregistry(id: "0xee1502e29795ef6c2d60f8d7120596abe3bad990") {
        id
        numberOfAbsent
        numberOfRegistered
        numberOfClearingRequested
        numberOfChallengedClearing
        numberOfRegistrationRequested
        numberOfChallengedRegistrations
        registrationMetaEvidence {
          URI
        }
      }
    }
  `

  const result = (await request({
    url: 'https://api.thegraph.com/subgraphs/name/kleros/legacy-curate-xdai',
    document: query,
  })) as any
  const itemCounts: ItemCounts = convertStringFieldsToNumber(result)

  // inject metadata into the uncomplete "ItemCounts". hacky code
  const regMEs = await Promise.all([
    fetch(
      'https://ipfs.kleros.io' + result?.Tags?.registrationMetaEvidence?.URI
    ).then((r) => r.json()),
    fetch(
      'https://ipfs.kleros.io' + result?.CDN?.registrationMetaEvidence?.URI
    ).then((r) => r.json()),
    fetch(
      'https://ipfs.kleros.io' + result?.Tokens?.registrationMetaEvidence?.URI
    ).then((r) => r.json()),
  ])
  itemCounts.Tags.metadata = {
    address: result?.Tags?.id,
    policyURI: regMEs[0].fileURI,
    logoURI: regMEs[0].metadata.logoURI,
    tcrTitle: regMEs[0].metadata.tcrTitle,
    tcrDescription: regMEs[0].metadata.tcrDescription,
  }
  itemCounts.CDN.metadata = {
    address: result?.CDN?.id,
    policyURI: regMEs[1].fileURI,
    logoURI: regMEs[1].metadata.logoURI,
    tcrTitle: regMEs[1].metadata.tcrTitle,
    tcrDescription: regMEs[1].metadata.tcrDescription,
  }
  itemCounts.Tokens.metadata = {
    address: result?.Tokens?.id,
    policyURI: regMEs[2].fileURI,
    logoURI: regMEs[2].metadata.logoURI,
    tcrTitle: regMEs[2].metadata.tcrTitle,
    tcrDescription: regMEs[2].metadata.tcrDescription,
  }
  // inject registry deposits as well
  const regDs = await Promise.all([
    fetchRegistryDeposits("0x66260c69d03837016d88c9877e61e08ef74c59f2"),
    fetchRegistryDeposits("0x957a53a994860be4750810131d9c876b2f52d6e1"),
    fetchRegistryDeposits("0xee1502e29795ef6c2d60f8d7120596abe3bad990"),
  ])
  itemCounts.Tags.deposits = regDs[0] as DepositParams
  itemCounts.CDN.deposits = regDs[1] as DepositParams
  itemCounts.Tokens.deposits = regDs[2] as DepositParams

  return itemCounts
}
