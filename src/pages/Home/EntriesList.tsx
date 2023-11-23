import React, { Dispatch, SetStateAction } from 'react'
import AddressDisplay from 'components/AddressDisplay'
import { statusColorMap } from 'utils/colorMappings'
import { fetchFromIPFS } from 'utils/fetchFromIPFS'
import { fetchEvidence } from 'utils/getEvidence'

const handleEntryClick = async (
  item: any,
  setDetailsData,
  setEntryStatus,
  setItemId,
  setEvidences,
  setIsDetailsModalOpen
) => {
  const details = await fetchFromIPFS(item.data)
  setDetailsData(details.values)
  setEntryStatus(item.status)
  setItemId(item.itemID)

  // Fetch evidences

  //const evidenceData = await item.requests[item.numberOfRequests - 1].evidences;

  const evidenceData = await fetchEvidence(
    item.requests[item.numberOfRequests - 1].evidenceGroup.id
  )

  const formattedEvidences = await Promise.all(
    evidenceData.map(async (e: any) => {
      const evi = await fetchFromIPFS(e.URI)
      return {
        title: evi.title,
        description: evi.description,
        time: new Date(e.timestamp * 1000).toLocaleString('en-GB'),
        party: e.party,
      }
    })
  )
  setEvidences(formattedEvidences as any)

  setIsDetailsModalOpen(true)
}

interface IEntriesList {
  displayedData: any
  activeList: any
  setDetailsData: Dispatch<SetStateAction<any>>
  setEntryStatus: Dispatch<SetStateAction<any>>
  setItemId: Dispatch<SetStateAction<any>>
  setEvidences: Dispatch<SetStateAction<any>>
  setIsDetailsModalOpen: Dispatch<SetStateAction<boolean>>
}

const EntriesList: React.FC<IEntriesList> = ({
  displayedData,
  activeList,
  setDetailsData,
  setEntryStatus,
  setItemId,
  setEvidences,
  setIsDetailsModalOpen,
}) => {
  return (
    <div className="w-4/5 mx-auto grid grid-cols-2 gap-6">
      {displayedData.map((item: any, index: number) => {
        return (
          <div
            key={index}
            className="bg-purple-600 p-4 rounded-lg break-words transform transition-all duration-150 hover:shadow-2xl active:scale-95"
            onClick={() =>
              handleEntryClick(
                item,
                setDetailsData,
                setEntryStatus,
                setItemId,
                setEvidences,
                setIsDetailsModalOpen
              )
            }
          >
            <div>
              <strong>Address:</strong> <AddressDisplay address={item.key0} />
            </div>
            {activeList === 'Tags' && (
              <div>
                <div>
                  <strong>Project:</strong> {item.key2}
                </div>
                <div>
                  <strong>Tag/label:</strong> {item.key1}
                </div>
                <div>
                  <strong>URL:</strong> {item.key3}
                </div>
              </div>
            )}
            {activeList === 'Tokens' && (
              <div>
                {item.props &&
                  item.props.find(
                    (prop: { label: string; value: string }) =>
                      prop.label === 'Logo'
                  ) && (
                    <div>
                      <img
                        src={`https://ipfs.kleros.io/${
                          item.props.find(
                            (prop: { label: string; value: string }) =>
                              prop.label === 'Logo'
                          ).value
                        }`}
                        alt="Logo"
                        style={{ width: '100px', height: '100px' }} // Adjust size as needed
                      />
                    </div>
                  )}
                <div>
                  <strong>Ticker:</strong> {item.key2}
                </div>
                <div>
                  <strong>Name:</strong> {item.key1}
                </div>
              </div>
            )}
            {activeList === 'CDN' && (
              <div>
                <div>
                  <strong>(Sub)domain:</strong> {item.key1}
                </div>
                {item.props &&
                  item.props.find(
                    (prop: { label: string; value: string }) =>
                      prop.label === 'Visual proof'
                  ) && (
                    <div>
                      <img
                        src={`https://ipfs.kleros.io/${
                          item.props.find(
                            (prop: { label: string; value: string }) =>
                              prop.label === 'Visual proof'
                          ).value
                        }`}
                        alt="Visual Proof"
                        style={{ width: '100%' }} // Adjust size as needed
                      />
                    </div>
                  )}
              </div>
            )}
            <div className="mt-2">
              <span
                className={`px-2 py-1 text-white rounded ${
                  statusColorMap[item.status] || 'bg-gray-400'
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
export default EntriesList
