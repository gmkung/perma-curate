import React from 'react'
import { useSearchParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'

const StyledButton = styled.button`
  background-color: #883ae1;
  border-radius: 12px;
  font-size: 22px;
  font-family: 'Orbitron', sans-serif;
  color: #ffffff;
  padding: 14px 20px;
  border: none;
  font-weight: 700;
  width: 100%;
  cursor: pointer;
  ${landscapeStyle(
    () => css`
      width: auto;
    `
  )};
  &:hover {
    background: linear-gradient(145deg, #a188d6, #7e57c2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
`

const SubmitButton: React.FC = () => {
  const [, setSearchParams] = useSearchParams()

  const openModal = () => {
    setSearchParams((prev) => {
      const registry = prev.get('registry') as string
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.append('additem', registry)
      return newParams
    })
  }

  return (
    <>
      <StyledButton onClick={() => openModal()}>Submit entry</StyledButton>
    </>
  )
}
export default SubmitButton
