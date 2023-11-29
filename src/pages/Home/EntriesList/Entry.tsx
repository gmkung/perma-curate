import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import AddressDisplay from 'components/AddressDisplay'
import { fetchFromIPFS } from 'utils/fetchFromIPFS'
import { fetchEvidence } from 'utils/getEvidence'

const Container = styled.div`
  display: flex;
  width: 84vw;
  flex-direction: column;
  box-sizing: border-box;
  gap: 8px;
  justify-content: center;
  align-items: center;
  background-color: #380c65;
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

  ${landscapeStyle(
    () => css`
      width: auto;
    `
  )}
`

const StatusSpan = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  color: white;
  border-radius: 4px;
  margin-top: 8px;
`

const Image = styled.img<{ isFullWidth: boolean }>`
  width: 100px;
  height: 100px;
  ${({ isFullWidth }) => isFullWidth && 'width: 100%; height: 100%;'}
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

interface IEntry {
  item
  setDetailsData
  setEntryStatus
  setItemId
  setEvidences
  setIsDetailsModalOpen
  activeList
}

const Entry: React.FC<IEntry> = ({
  item,
  setDetailsData,
  setEntryStatus,
  setItemId,
  setEvidences,
  setIsDetailsModalOpen,
  activeList,
}) => {
  return (
    <Container
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
      <StatusSpan status={item.status}>{item.status}</StatusSpan>

      <strong>
        <AddressDisplay address={item.key0} />
      </strong>

      {activeList === 'Tags' && (
        <div>
          <div>{item.key2}</div>
          <div>{item.key1}</div>
          <div>{item.key3}</div>
        </div>
      )}
      {activeList === 'Tokens' && (
        <div>
          {item.props && item.props.find((prop) => prop.label === 'Logo') && (
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
          <div>{item.key2}</div>
          <div>{item.key1}</div>
        </div>
      )}
      {activeList === 'CDN' && (
        <div>
          <div>{item.key1}</div>
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
    </Container>
  )
}

export default Entry
