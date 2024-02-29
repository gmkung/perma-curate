import React, { useMemo, useRef } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { responsiveSize } from 'styles/responsiveSize'
import { useSearchParams } from 'react-router-dom'
import AddAddressTag from './AddTag'
import AddToken from './AddToken'
import AddCDN from './AddCDN'

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
  background-color: #5a2393;
  border-radius: 12px;
  width: 84vw;
  max-height: 85%;
  overflow-y: auto;
  position: relative;

  ${landscapeStyle(
    () => css`
      width: 75%;
    `
  )}
`

export const AddContainer = styled.div`
  display: flex;
  padding: ${responsiveSize(16, 32)};
  flex-direction: column;
  gap: 12px;
`

export const StyledWholeField = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledTextInput = styled.input`
  display: flex;
  padding: 12px;
  outline: none;
  border: 2px solid #805ad5;
  border-left: 0;
  color: #2d3748;
  border-radius: 12px;
  border-radius: 0 12px 12px 12px;
  font-family: 'Oxanium', sans-serif;
  font-size: 16px;
  font-weight: 700;
  ::placeholder {
    font-family: 'Oxanium', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #c7c7c7;
  }

  ${landscapeStyle(
    () => css`
      width: 95%;
      padding-left: 24px;
      border-radius: 0 12px 12px 0;
    `
  )}
`

export const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 20px;
  gap: 16px;
`

export const StyledReturnButton = styled.button`
  background-color: #9f7aea;
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
    background-color: #8e6ac1;
  }

  &:disabled {
    background-color: #e2d8f0;
    color: #c7c7c7;
    cursor: not-allowed;
  }

  ${landscapeStyle(
    () => css`
      padding: 12px 48px;
    `
  )}
`

export const SubmitButton = styled.button`
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

  ${landscapeStyle(
    () => css`
      padding: 12px 48px;
    `
  )}
`

export const ErrorMessage = styled.div`
  color: red;
  margin-top: 10px;
  font-size: 14px;
`

export const ReturnButton = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const closeModal = () => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.delete('additem')
      return newParams
    })
  }

  return (
    <StyledReturnButton onClick={() => closeModal()}>Return</StyledReturnButton>
  )
}

const AddEntryModal: React.FC = () => {
  const containerRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const addingItemToRegistry = useMemo(
    () => searchParams.get('additem'),
    [searchParams]
  )

  return (
    <ModalOverlay>
      <ModalContainer ref={containerRef}>
        {addingItemToRegistry === 'Tags' ? (
          <AddAddressTag />
        ) : addingItemToRegistry === 'CDN' ? (
          <AddCDN />
        ) : addingItemToRegistry === 'Tokens' ? (
          <AddToken />
        ) : null}
      </ModalContainer>
    </ModalOverlay>
  )
}

export default AddEntryModal
