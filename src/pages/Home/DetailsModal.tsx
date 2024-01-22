import React, { useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import ReactMarkdown from 'react-markdown'
import { renderValue } from 'utils/renderValue'
import { statusColorMap } from 'utils/colorMappings'
import { performEvidenceBasedRequest } from 'utils/performEvidenceBasedRequest'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchItemDetails } from 'utils/itemDetails'
import LoadingItems from './LoadingItems'
import { useFocusOutside } from 'hooks/useFocusOutside'
import {
  DepositParams,
  fetchRegistryDeposits,
} from 'utils/fetchRegistryDeposits'
import { fetchArbitrationCost } from 'utils/fetchArbitrationCost'
import { formatEther } from 'ethers'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
`

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 12px;
  width: 75%;
  height: 75%;
  position: relative;
  color: #4a5568;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
`

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
`

const ConfirmationBox = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%;
  background-color: #f7fafc;
  border-radius: 12px;
  padding: 24px;
  color: #4a5568;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const ConfirmationTitle = styled.h3``

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
`

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
`

const ActionButton = styled.button<{ isConfirm: boolean }>`
  padding: 8px 16px;
  border-radius: 4px;
  ${({ isConfirm }) =>
    isConfirm
      ? 'background-color: #3182ce; color: white;'
      : 'border: 1px solid #e2e8f0;'}
`

const StatusButton = styled.button<{ status: string }>`
  position: absolute;
  top: 8px;
  right: 64px;
  z-index: 10;
  border-radius: 9999px;
  padding: 8px 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
  ${({ status }) =>
    status === 'Registered'
      ? 'background-color: #ed8936; color: white;'
      : status === 'RegistrationRequested'
      ? 'background-color: #f56565; color: white;'
      : 'background-color: #f56565; color: white;'}
`

const DetailsContent = styled.div`
  padding: 32px;
  overflow-y: auto;
  flex-grow: 1;
`

const EvidenceSection = styled.div`
  gap: 16px;
`

const StatusSpan = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  color: white;
  border-radius: 4px;
  background-color: ${({ status }) => statusColorMap[status]};
`
const EntryDetailsHeader = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
`

const EntryDetailsContainer = styled.div`
  padding: 16px;
  margin-bottom: 16px;
  border-bottom: 2px solid #edf2f7;
`
const EvidenceSectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const EvidenceHeader = styled.h2`
  font-size: 1.25rem; // 20px
  margin-bottom: 16px;
`

const SubmitEvidenceButton = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  &:hover {
    background-color: #2b6cb0;
  }
`

const Evidence = styled.div`
  padding: 12px;
  background-color: #f7fafc;
  border-radius: 4px;
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
  const [evidenceTitle, setEvidenceTitle] = useState('')
  const [evidenceText, setEvidenceText] = useState('')

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
  })

  // the registry can be fetched directly from itemDetailsId.
  const registryParsedFromItemId = itemDetailsId
    ? itemDetailsId.split('@')[1]
    : ''

  const {
    isLoading: depositsLoading,
    error: depositsError,
    data: depositsData,
  } = useQuery({
    queryKey: ['deposits', registryParsedFromItemId],
    queryFn: () => fetchRegistryDeposits(registryParsedFromItemId),
  })

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
  const containerRef = useRef(null)
  useFocusOutside(containerRef, () => closeModal())

  const formattedDepositCost = useMemo(() => {
    if (!detailsData || !depositsData || arbitrationCostData === undefined)
      return '??? xDAI'
    let sum = 0n
    if (detailsData.status === 'Registered') {
      sum = arbitrationCostData + depositsData.removalBaseDeposit
    } else if (detailsData.status === 'RegistrationRequested') {
      sum = arbitrationCostData + depositsData.submissionChallengeBaseDeposit
    } else if (detailsData.status === 'ClearingRequested') {
      sum = arbitrationCostData + depositsData.removalChallengeBaseDeposit
    }
    return `${Number(formatEther(sum))} xDAI`
  }, [detailsData, depositsData, arbitrationCostData])

  return (
    <ModalOverlay>
      <ModalContainer ref={containerRef}>
        <CloseButton
          onClick={() => {
            closeModal()
          }}
        >
          X
        </CloseButton>

        {detailsLoading || !detailsData ? (
          <LoadingItems />
        ) : (
          <>
            {/* Confirmation Box */}
            {isConfirmationOpen && (
              <ConfirmationBox>
                <ConfirmationTitle>
                  {(() => {
                    switch (evidenceConfirmationType) {
                      case 'Evidence':
                        return 'Enter the evidence message you want to submit'
                      case 'RegistrationRequested':
                        return 'Provide a reason for challenging this entry'
                      case 'Registered':
                        return 'Provide a reason for removing this entry'
                      case 'ClearingRequested':
                        return 'Provide a reason for challenging this removal request'
                      default:
                        return 'Default message'
                    }
                  })()}
                </ConfirmationTitle>
                <label>Message title</label>
                <TextArea
                  rows={1}
                  value={evidenceTitle}
                  onChange={(e) => setEvidenceTitle(e.target.value)}
                ></TextArea>
                <label>Evidence message</label>
                <TextArea
                  rows={3}
                  value={evidenceText}
                  onChange={(e) => setEvidenceText(e.target.value)}
                ></TextArea>
                <ButtonGroup>
                  <ActionButton
                    isConfirm={isConfirmationOpen}
                    onClick={() => setIsConfirmationOpen(false)}
                  >
                    Cancel
                  </ActionButton>
                  <ActionButton
                    isConfirm={isConfirmationOpen}
                    onClick={async () => {
                      let result = false // a flag to check if the function execution was successful
                      result = await performEvidenceBasedRequest(
                        detailsData,
                        depositsData as DepositParams,
                        arbitrationCostData as bigint,
                        evidenceTitle,
                        evidenceText,
                        evidenceConfirmationType
                      )

                      // Check if the function was executed successfully
                      if (result) {
                        closeModal()
                      }
                    }}
                  >
                    Confirm
                  </ActionButton>
                </ButtonGroup>
              </ConfirmationBox>
            )}

            {/* Status-based Button */}
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

            {/* DETAILS */}
            <DetailsContent>
              <EntryDetailsHeader>Entry details</EntryDetailsHeader>
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
                  <SubmitEvidenceButton
                    onClick={() => {
                      setIsConfirmationOpen(true)
                      setEvidenceConfirmationType('Evidence')
                    }}
                  >
                    Submit Evidence
                  </SubmitEvidenceButton>
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
