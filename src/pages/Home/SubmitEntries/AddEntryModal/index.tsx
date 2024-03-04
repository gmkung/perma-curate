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
      width: 43%;
    `
  )}
`

export const AddContainer = styled.div`
  display: flex;
  padding: ${responsiveSize(16, 32)};
  flex-direction: column;
  gap: 18px;
`

export const AddHeader = styled.div`
  margin-bottom: 20px;
`

export const AddTitle = styled.h2`
  margin: 0;
  margin-bottom: 4px;
`

export const AddSubtitle = styled.div`
  font-size: 15px;
  opacity: 70%;
`

export const StyledGoogleFormAnchor = styled.a`
  color: #fff;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }
`

export const StyledWholeField = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledTextInput = styled.input`
  display: flex;
  background: #855caf;
  padding: 8px 12px;
  outline: none;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 20px;
  font-weight: 700;

  ::placeholder {
    font-weight: 700;
    color: #cd9dff;
  }

  ${landscapeStyle(
    () => css`
      width: 93%;
      padding-left: 24px;
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
    background-color: #a092b1;
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
    <StyledReturnButton onClick={() => closeModal()}>Back</StyledReturnButton>
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
