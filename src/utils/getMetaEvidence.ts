// fetchData.ts

import client from "@/utils/apollo";
import { gql } from "@apollo/client";

export async function fetchMetaEvidence(
  registryAddress: string,
  metaEvidenceUpdates: number
) {
  const metaEvidenceSuffix = metaEvidenceUpdates * 2 - 1;
  const idString =
    registryAddress.toLowerCase() + metaEvidenceSuffix.toString();
  const QUERY = gql`
        {
            metaEvidences (where:{id:"${idString}"}){
              id
              URI
            }
        }
        `;
  console.log("Metaevidence results before", QUERY);
  const { data } = await client.query({ query: QUERY });

  return data;
}
