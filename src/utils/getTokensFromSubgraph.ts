// fetchData.ts

import client from "@/utils/apollo";
import { gql } from "@apollo/client";

export async function fetchTokens() {
  const BATCH_SIZE = 1000;
  let allItems = [] as any[];
  let skip = 0;
  let hasMore = true;

  while (hasMore) {
    const QUERY = gql`
        {
            litems (first: ${BATCH_SIZE}, skip: ${skip}, orderBy:latestRequestSubmissionTime, orderDirection:desc,
                where:{registryAddress:"0xee1502e29795ef6c2d60f8d7120596abe3bad990"}){
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
        `;

    const { data } = await client.query({ query: QUERY });

    if (!data || !data.litems || data.litems.length === 0) {
      hasMore = false;
    } else {
      allItems = [...allItems, ...data.litems];
      skip += BATCH_SIZE;
    }
  }

  return allItems;
}

/*
requests{
  evidences {
      id
      item {
          id
      }
      timestamp
      URI
      arbitrator
      party
  }
}
*/
