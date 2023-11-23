// fetchData.ts

import client from './apollo'
import { gql } from '@apollo/client'

export async function fetchEvidence(evidenceGroup: string) {
  const BATCH_SIZE = 1000
  let allItems = [] as any[]
  let skip = 0
  let hasMore = true

  while (hasMore) {
    const QUERY = gql`
        {
          evidences(first: ${BATCH_SIZE}, skip: ${skip}, orderBy:timestamp, orderDirection:desc, where:{evidenceGroup:"${evidenceGroup}"}) {
            id
            timestamp
            URI
            arbitrator
            party
           }
        }
        `

    const { data } = await client.query({ query: QUERY })

    if (!data || !data.evidences || data.evidences.length === 0) {
      hasMore = false
    } else {
      allItems = [...allItems, ...data.evidences]
      skip += BATCH_SIZE
    }
  }

  return allItems
}
