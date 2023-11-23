import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { renderValue } from '../../utils/renderValue'
import { statusColorMap } from '../../utils/colorMappings'
import ReactMarkdown from 'react-markdown'
import { performEvidenceBasedRequest } from '../../utils/performEvidenceBasedRequest'

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

interface IDetailsModal {
  setIsDetailsModalOpen: Dispatch<SetStateAction<boolean>>
  curateContractAddress: string
  depositParams: any
  itemId: string
  entryStatus: any
  detailsData: any
  evidences: any
}

const DetailsModal: React.FC<IDetailsModal> = ({
  setIsDetailsModalOpen,
  curateContractAddress,
  depositParams,
  itemId,
  entryStatus,
  detailsData,
  evidences,
}) => {
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [evidenceConfirmationType, setEvidenceConfirmationType] = useState('')
  const [evidenceTitle, setEvidenceTitle] = useState('')
  const [evidenceText, setEvidenceText] = useState('')

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton
          onClick={() => {
            setIsDetailsModalOpen(false)
            setIsConfirmationOpen(false)
          }}
        >
          X
        </CloseButton>

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
                    curateContractAddress,
                    depositParams,
                    itemId,
                    evidenceTitle,
                    evidenceText,
                    evidenceConfirmationType
                  )

                  // Check if the function was executed successfully
                  if (result) {
                    setIsDetailsModalOpen(false)
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
            setEvidenceConfirmationType(entryStatus)
          }}
          status={entryStatus}
        >
          {entryStatus === 'Registered' && 'Remove entry'}
          {entryStatus === 'RegistrationRequested' && 'Challenge registration'}
          {entryStatus === 'ClearingRequested' && 'Challenge removal'}
        </StatusButton>

        {/* DETAILS */}
        <DetailsContent>
          <h2 className="text-xl font-semibold mb-4">Entry details</h2>
          <div className="p-4 mb-4 border-b-2 border-gray-200">
            <StatusSpan status={entryStatus}>{entryStatus}</StatusSpan>
            {detailsData &&
              Object.entries(detailsData).map(([key, value], idx) => (
                <div key={idx}>
                  <strong>{key}:</strong> {renderValue(key, value)}
                </div>
              ))}
          </div>
          {/* EVIDENCES */}
          <EvidenceSection>
            <div className="flex justify-between items-center">
              <h2 className="text-xl mb-4">Evidences</h2>
              <button
                onClick={() => {
                  setIsConfirmationOpen(true)
                  setEvidenceConfirmationType('Evidence')
                }} // Trigger the confirmation for submitting evidence
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Submit Evidence
              </button>
            </div>
            {evidences.length > 0 ? (
              evidences.map((evidence, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-100 rounded font-serif shadow-lg"
                >
                  <div className="mb-2">
                    <strong>Title:</strong> {evidence.title}
                  </div>
                  <div className="mb-2">
                    <strong>Description:</strong>
                    <ReactMarkdown>{evidence.description}</ReactMarkdown>
                  </div>
                  <div className="mb-2">
                    <strong>Time:</strong> {evidence.time}
                  </div>
                  <div>
                    <strong>Party:</strong> {evidence.party}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-light-gray italic">
                No evidence submitted yet...
              </div>
            )}
          </EvidenceSection>
        </DetailsContent>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default DetailsModal
