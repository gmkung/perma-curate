import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import AddressDisplay from '../../components/AddressDisplay'
import { statusColorMap } from '../../utils/colorMappings'
import { fetchFromIPFS } from '../../utils/fetchFromIPFS'
import { fetchEvidence } from '../../utils/getEvidence'

const EntriesContainer = styled.div`
  width: 80%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
`

const Entry = styled.div`
  background-color: #805ad5;
  padding: 16px;
  border-radius: 12px;
  word-break: break-word;
  transition: transform 150ms ease-in-out, box-shadow 150ms ease-in-out;
  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
  &:active {
    transform: scale(0.95);
  }
`

const StatusSpan = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  color: white;
  border-radius: 4px;
  background-color: ${({ status }) => statusColorMap[status] || '#a0aec0'};
  margin-top: 8px;
`

const Image = styled.img<{ isFullWidth: boolean }>`
  width: 100px;
  height: 100px;
  ${({ isFullWidth }) => isFullWidth && 'width: 100%;'}
`

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
    <EntriesContainer>
      {displayedData.map((item, index) => (
        <Entry
          key={index}
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
                item.props.find((prop) => prop.label === 'Logo') && (
                  <div>
                    <Image
                      src={`https://ipfs.kleros.io/${
                        item.props.find((prop) => prop.label === 'Logo').value
                      }`}
                      alt="Logo"
                      isFullWidth={false}
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
                item.props.find((prop) => prop.label === 'Visual proof') && (
                  <div>
                    <Image
                      src={`https://ipfs.kleros.io/${
                        item.props.find((prop) => prop.label === 'Visual proof')
                          .value
                      }`}
                      alt="Visual Proof"
                      isFullWidth={true}
                    />
                  </div>
                )}
            </div>
          )}
          <StatusSpan status={item.status}>{item.status}</StatusSpan>
        </Entry>
      ))}
    </EntriesContainer>
  )
}

export default EntriesList
