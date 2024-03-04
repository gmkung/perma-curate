import React, { useMemo, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { responsiveSize } from 'styles/responsiveSize'
import ReactMarkdown from 'react-markdown'
import { useSearchParams } from 'react-router-dom'
import { formatEther } from 'ethers'
import { useFocusOutside } from 'hooks/useFocusOutside'
import { useQuery } from '@tanstack/react-query'
import { renderValue } from 'utils/renderValue'
import { statusColorMap } from 'utils/colorMappings'
import { fetchArbitrationCost } from 'utils/fetchArbitrationCost'
import { fetchItemCounts } from 'utils/itemCounts'
import { revRegistryMap } from 'utils/fetchItems'
import { fetchItemDetails } from 'utils/itemDetails'
import LoadingItems from '../LoadingItems'
import ConfirmationBox from './ConfirmationBox'
import { SubmitButton } from '../SubmitEntries/AddEntryModal'

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
`

const ModalContainer = styled.div`
  display: flex;
  background-color: #5a2393;
  border-radius: 12px;
  width: 84vw;
  max-height: 85vh;
  overflow-y: auto;
  color: #fff;
  flex-direction: column;
  flex-wrap: wrap;
  position: relative;

  ${landscapeStyle(
    () => css`
      width: 75%;
    `
  )}
`

const EntryDetailsHeader = styled.h1`
  margin: 0;
`

const StatusButton = styled.button<{ status: string }>`
  background-color: #3182ce;
  color: white;
  padding: 12px 24px;
  font-family: 'Oxanium', sans-serif;
  font-size: 16px;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #6f42c1;
  }

  &:disabled {
    background-color: #c7c7c7;
    cursor: not-allowed;
  }

  ${({ status }) =>
    status === 'Registered'
      ? 'background-color: #ed8936; color: white;'
      : status === 'RegistrationRequested'
      ? 'background-color: #f56565; color: white;'
      : 'background-color: #f56565; color: white;'}

  ${landscapeStyle(
    () => css`
      padding: 12px 48px;
    `
  )}
`

const DetailsContent = styled.div`
  padding: ${responsiveSize(16, 24)};
  flex-grow: 1;
`

const EvidenceSection = styled.div`
  gap: 16px;
`

const StatusSpan = styled.span<{ status: string }>`
  display: flex;
  width: 180px;
  padding: 4px 8px;
  color: white;
  border-radius: 4px;
  background-color: ${({ status }) => statusColorMap[status]};
`
const Header = styled.div`
  display: flex;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
`

const EntryDetailsContainer = styled.div`
  display: flex;
  padding: 20px 0;
  flex-direction: column;
  margin-bottom: 16px;
  border-bottom: 2px solid #edf2f7;
  gap: 16px;
  flex-wrap: wrap;

  img {
    width: 150px !important;
    height: 150px !important;
  }
`

const EvidenceSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
`

const EvidenceHeader = styled.h2`
  font-size: 1.25rem; // 20px
  margin: 0;
`

const Evidence = styled.div`
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #edf2f7;
  font-family: serif;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`

const EvidenceTitle = styled.div`
  margin-bottom: 8px;
`

const EvidenceDescription = styled.div`
  margin-bottom: 8px;
`

const EvidenceTime = styled.div`
  margin-bottom: 8px;
`

const EvidenceParty = styled.div``

const NoEvidenceText = styled.div`
  color: #a0aec0;
  font-style: italic;
`

const DetailsModal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [evidenceConfirmationType, setEvidenceConfirmationType] = useState('')

  const itemDetailsId = useMemo(
    () => searchParams.get('itemdetails'),
    [searchParams]
  )

  const {
    isLoading: detailsLoading,
    error: detailsError,
    data: detailsData,
  } = useQuery({
    queryKey: ['details', itemDetailsId || ''],
    queryFn: () => fetchItemDetails(itemDetailsId || ''),
    staleTime: Infinity,
  })

  // the registry can be fetched directly from itemDetailsId.
  const registryParsedFromItemId = itemDetailsId
    ? itemDetailsId.split('@')[1]
    : ''

  const {
    isLoading: countsLoading,
    error: countsError,
    data: countsData,
  } = useQuery({
    queryKey: ['counts'],
    queryFn: () => fetchItemCounts(),
    staleTime: Infinity,
  })

  const deposits = useMemo(() => {
    if (!countsData) return undefined
    return countsData[revRegistryMap[registryParsedFromItemId]].deposits
  }, [countsData, registryParsedFromItemId])

  // get arbitrationCost, keyed by arbitrator and arbitratorExtraData
  const {
    isLoading: arbitrationCostLoading,
    error: arbitrationCostError,
    data: arbitrationCostData,
  } = useQuery({
    queryKey: [
      'arbitrationCost',
      detailsData?.requests?.[0].arbitrator || '',
      detailsData?.requests?.[0].arbitratorExtraData || '',
    ],
    queryFn: () =>
      fetchArbitrationCost(
        detailsData?.requests?.[0].arbitrator || '',
        detailsData?.requests?.[0].arbitratorExtraData || ''
      ),
    staleTime: Infinity,
  })

  const evidences = useMemo(() => {
    if (!detailsData) return []
    return detailsData.requests.map((r) => r.evidenceGroup.evidences).flat(1)
  }, [detailsData])

  const closeModal = () => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.delete('itemdetails')
      return newParams
    })
    setIsConfirmationOpen(false)
  }
  console.log(detailsData)

  const containerRef = useRef(null)
  useFocusOutside(containerRef, () => closeModal())

  const formattedDepositCost = useMemo(() => {
    if (!detailsData || !deposits || arbitrationCostData === undefined)
      return '??? xDAI'
    let sum = 0n
    if (detailsData.status === 'Registered') {
      sum = arbitrationCostData + deposits.removalBaseDeposit
    } else if (detailsData.status === 'RegistrationRequested') {
      sum = arbitrationCostData + deposits.submissionChallengeBaseDeposit
    } else if (detailsData.status === 'ClearingRequested') {
      sum = arbitrationCostData + deposits.removalChallengeBaseDeposit
    }
    return `${Number(formatEther(sum))} xDAI`
  }, [detailsData, deposits, arbitrationCostData])

  return (
    <ModalOverlay>
      <ModalContainer ref={containerRef}>
        {detailsLoading || !detailsData ? (
          <LoadingItems />
        ) : (
          <>
            {/* ConfirmationBox Modal */}
            {isConfirmationOpen && (
              <ConfirmationBox
                evidenceConfirmationType={evidenceConfirmationType}
                isConfirmationOpen={isConfirmationOpen}
                setIsConfirmationOpen={setIsConfirmationOpen}
                detailsData={detailsData}
                deposits={deposits}
                arbitrationCostData={arbitrationCostData}
              />
            )}

            {/* DETAILS */}
            <DetailsContent>
              <Header>
                <EntryDetailsHeader>Entry details</EntryDetailsHeader>
                <StatusButton
                  onClick={() => {
                    setIsConfirmationOpen(true)
                    setEvidenceConfirmationType(detailsData.status)
                  }}
                  status={detailsData.status}
                >
                  {detailsData.status === 'Registered' && `Remove entry`}
                  {detailsData.status === 'RegistrationRequested' &&
                    'Challenge registration'}
                  {detailsData.status === 'ClearingRequested' &&
                    'Challenge removal'}
                  {' — ' + formattedDepositCost}
                </StatusButton>
              </Header>
              <EntryDetailsContainer>
                <StatusSpan status={detailsData.status}>
                  {detailsData.status}
                </StatusSpan>
                {detailsData.props &&
                  detailsData.props.map(({ label, value }) => (
                    <div key={label}>
                      <strong>{label}:</strong> {renderValue(label, value)}
                    </div>
                  ))}
              </EntryDetailsContainer>
              {/* EVIDENCES */}
              <EvidenceSection>
                <EvidenceSectionHeader>
                  <EvidenceHeader>Evidences</EvidenceHeader>
                  <SubmitButton
                    onClick={() => {
                      setIsConfirmationOpen(true)
                      setEvidenceConfirmationType('Evidence')
                    }}
                  >
                    Submit Evidence
                  </SubmitButton>
                </EvidenceSectionHeader>

                {evidences.length > 0 ? (
                  evidences.map((evidence, idx) => (
                    <Evidence key={idx}>
                      <EvidenceTitle>
                        <strong>Title:</strong> {evidence.title}
                      </EvidenceTitle>
                      <EvidenceDescription>
                        <strong>Description:</strong>
                        <ReactMarkdown>
                          {evidence.description || ''}
                        </ReactMarkdown>
                      </EvidenceDescription>
                      <EvidenceTime>
                        <strong>Time:</strong> {evidence.timestamp}
                      </EvidenceTime>
                      <EvidenceParty>
                        <strong>Party:</strong> {evidence.party}
                      </EvidenceParty>
                    </Evidence>
                  ))
                ) : (
                  <NoEvidenceText>No evidence submitted yet...</NoEvidenceText>
                )}
              </EvidenceSection>
            </DetailsContent>
          </>
        )}
      </ModalContainer>
    </ModalOverlay>
  )
}

export default DetailsModal
