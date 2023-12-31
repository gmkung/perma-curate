import { gql, request } from 'graphql-request'

export interface ItemCounts {
  Tags: {
    numberOfAbsent: number
    numberOfRegistered: number
    numberOfClearingRequested: number
    numberOfChallengedClearing: number
    numberOfRegistrationRequested: number
    numberOfChallengedRegistrations: number
  }
  CDN: {
    numberOfAbsent: number
    numberOfRegistered: number
    numberOfClearingRequested: number
    numberOfChallengedClearing: number
    numberOfRegistrationRequested: number
    numberOfChallengedRegistrations: number
  }
  Tokens: {
    numberOfAbsent: number
    numberOfRegistered: number
    numberOfClearingRequested: number
    numberOfChallengedClearing: number
    numberOfRegistrationRequested: number
    numberOfChallengedRegistrations: number
  }
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
        numberOfAbsent
        numberOfRegistered
        numberOfClearingRequested
        numberOfChallengedClearing
        numberOfRegistrationRequested
        numberOfChallengedRegistrations
      }
      CDN: lregistry(id: "0x957a53a994860be4750810131d9c876b2f52d6e1") {
        numberOfAbsent
        numberOfRegistered
        numberOfClearingRequested
        numberOfChallengedClearing
        numberOfRegistrationRequested
        numberOfChallengedRegistrations
      }
      Tokens: lregistry(id: "0xee1502e29795ef6c2d60f8d7120596abe3bad990") {
        numberOfAbsent
        numberOfRegistered
        numberOfClearingRequested
        numberOfChallengedClearing
        numberOfRegistrationRequested
        numberOfChallengedRegistrations
      }
    }
  `

  const result = (await request({
    url: 'https://api.thegraph.com/subgraphs/name/kleros/legacy-curate-xdai',
    document: query,
  })) as any
  const itemCounts: ItemCounts = convertStringFieldsToNumber(result)
  return itemCounts
}
