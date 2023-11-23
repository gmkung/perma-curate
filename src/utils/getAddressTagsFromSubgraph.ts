// fetchData.ts

import client from 'utils/apollo'
import { gql } from '@apollo/client'

export async function fetchTags() {
  const BATCH_SIZE = 1000
  let allItems = [] as any[]
  let skip = 0
  let hasMore = true

  while (hasMore) {
    const QUERY = gql`
        {
            litems (first: ${BATCH_SIZE}, skip: ${skip}, orderBy:latestRequestSubmissionTime, orderDirection:desc,
                where:{registryAddress:"0x66260C69d03837016d88c9877e61e08Ef74C59F2"}){
                  itemID
                  data
                  key0
                  key1
                  key2
                  key3
                  key4
                  numberOfRequests
                  status
                  props
                    { 
                      type 
                      label 
                      description 
                      value
                    }
                  requests{
                    evidenceGroup{id}
                }
            }
        }
        `

    const { data } = await client.query({ query: QUERY })

    if (!data || !data.litems || data.litems.length === 0) {
      hasMore = false
    } else {
      allItems = [...allItems, ...data.litems]
      skip += BATCH_SIZE
    }
  }

  return allItems
}
