import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

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
  padding: 32px;
  border-radius: 12px;
  width: 50%;
  height: 80%;
  position: relative;
  overflow-y: auto;
`

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  color: #4a5568;
`

const Form = styled.form`
  // No specific styles required
`

const InputGroup = styled.div`
  margin-bottom: 8px;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem; // 14px
  font-weight: bold;
  margin-bottom: 8px;
  color: #4a5568;
`

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #4a5568;
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  color: #4a5568;
`

const SubmitButton = styled.button`
  background-color: #3182ce;
  color: white;
  padding: 8px;
  border-radius: 4px;
  ${({ disabled }) =>
    disabled
      ? 'opacity: 0.5; cursor: not-allowed;'
      : '&:hover { background-color: #2b6cb0; }'}
`

interface IAddEntryModal {
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
  handleFormSubmit: any
  activeList: any
  handleImageUpload: any
  depositParams: any
  isImageUploadSuccessful: boolean
}

const AddEntryModal: React.FC<IAddEntryModal> = ({
  setIsModalOpen,
  handleFormSubmit,
  activeList,
  handleImageUpload,
  depositParams,
  isImageUploadSuccessful,
}) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={() => setIsModalOpen(false)}>X</CloseButton>
        <Form onSubmit={handleFormSubmit}>
          {/* Contract Address */}
          <InputGroup>
            <Label htmlFor="contractAddress">Contract Address:</Label>
            <Input
              type="text"
              id="contractAddress"
              name="contractAddress"
              placeholder="Enter contract address"
              required
            />
          </InputGroup>

          {/* Conditional fields based on activeList */}
          {activeList === 'Tags' && (
            <>
              <InputGroup>
                <Label htmlFor="publicNameTag">Public Name Tag:</Label>
                <Input
                  type="text"
                  id="publicNameTag"
                  name="publicNameTag"
                  placeholder="Enter public name tag"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="projectName">Project Name:</Label>
                <Input
                  type="text"
                  id="projectName"
                  name="projectName"
                  placeholder="Enter project name"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="uiLink">UI/Website Link:</Label>
                <Input
                  type="url"
                  id="uiLink"
                  name="uiLink"
                  placeholder="Enter UI or website link"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="publicNote">Public Note:</Label>
                <TextArea
                  id="publicNote"
                  name="publicNote"
                  placeholder="Enter public note"
                  rows={4}
                ></TextArea>
              </InputGroup>
            </>
          )}

          {activeList === 'CDN' && (
            <>
              <InputGroup>
                <Label htmlFor="domainName">Domain Name:</Label>
                <Input
                  type="text"
                  id="domainName"
                  name="domainName"
                  placeholder="Enter domain name"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Visual Proof:</Label>
                <Input
                  type="file"
                  id="visualProof"
                  name="visualProof"
                  accept="image/*"
                  onChange={handleImageUpload}
                  required
                />
              </InputGroup>
            </>
          )}

          {activeList === 'Tokens' && (
            <>
              <InputGroup>
                <Label htmlFor="name">Name:</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  maxLength={40}
                  placeholder="Enter name"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="symbol">Symbol:</Label>
                <Input
                  type="text"
                  id="symbol"
                  name="symbol"
                  maxLength={20}
                  placeholder="Enter symbol"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label htmlFor="decimals">Decimals:</Label>
                <Input
                  type="number"
                  id="decimals"
                  name="decimals"
                  placeholder="Enter decimals"
                  required
                />
              </InputGroup>
              <InputGroup>
                <Label>Logo:</Label>
                <Input
                  type="file"
                  id="logoImage"
                  name="logoImage"
                  accept=".png"
                  onChange={handleImageUpload}
                  required
                />
              </InputGroup>
            </>
          )}

          {depositParams ? (
            <p style={{ color: '#718096' }}>
              Submission Base Deposit:{' '}
              {depositParams.submissionBaseDeposit +
                depositParams.arbitrationCost}{' '}
              xDAi
            </p>
          ) : null}

          <SubmitButton
            type="submit"
            disabled={activeList !== 'Tags' && !isImageUploadSuccessful}
          >
            Submit
          </SubmitButton>
        </Form>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default AddEntryModal
