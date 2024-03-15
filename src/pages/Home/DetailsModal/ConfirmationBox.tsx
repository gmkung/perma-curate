import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { responsiveSize } from 'styles/responsiveSize'
import { ModalOverlay } from '.'
import { performEvidenceBasedRequest } from 'utils/performEvidenceBasedRequest'
import { DepositParams } from 'utils/fetchRegistryDeposits'
import { SubmitButton } from '../SubmitEntries/AddEntryModal'
import { StyledCloseButton, ClosedButtonContainer } from '..'

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 84vw;
  background-color: #5a2393;
  border-radius: 12px;
  color: #fff;
  display: flex;
  flex-direction: column;

  ${landscapeStyle(
    () => css`
      width: 50%;
    `
  )}
`

const InnerContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  padding: ${responsiveSize(16, 24)};
  gap: 16px;
`

const ConfirmationTitle = styled.h3`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 0;
  gap: 24px;
`

const TextArea = styled.textarea`
  width: 93%;
  padding: 8px;
  border: none;
  outline: none;
  overflow: auto;
  border-radius: 4px;
  background: #855caf;
  color: #fff;

  :active {
    border: none;
  }

  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;

  ${landscapeStyle(
    () => css`
      width: 97%;
    `
  )}
`

interface IConfirmationBox {
  evidenceConfirmationType: string
  isConfirmationOpen: boolean
  setIsConfirmationOpen: (isOpen: boolean) => void
}

const ConfirmationBox: React.FC<IConfirmationBox> = ({
  evidenceConfirmationType,
  isConfirmationOpen,
  setIsConfirmationOpen,
  detailsData,
  deposits,
  arbitrationCostData,
}) => {
  const [evidenceTitle, setEvidenceTitle] = useState('')
  const [evidenceText, setEvidenceText] = useState('')

  return (
    <>
      <ModalOverlay />
      <Container>
        <InnerContainer>
          <ConfirmationTitle>
            <div>
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
            </div>
            <ClosedButtonContainer onClick={() => setIsConfirmationOpen(false)}>
              <StyledCloseButton />
            </ClosedButtonContainer>
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
          <SubmitButton
            onClick={async () => {
              let result = false // a flag to check if the function execution was successful
              result = await performEvidenceBasedRequest(
                detailsData,
                deposits as DepositParams,
                arbitrationCostData as bigint,
                evidenceTitle,
                evidenceText,
                evidenceConfirmationType
              )

              if (result) {
                setIsConfirmationOpen(false)
              }
            }}
          >
            Confirm
          </SubmitButton>
        </InnerContainer>
      </Container>
    </>
  )
}
export default ConfirmationBox
