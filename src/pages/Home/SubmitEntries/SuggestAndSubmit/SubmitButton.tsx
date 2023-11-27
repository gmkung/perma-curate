import React from 'react'
import styled from 'styled-components'
import { useToggle } from 'react-use'
import AddEntryModal from '../AddEntryModal'

const StyledButton = styled.button`
  background-color: #883ae1;
  border-radius: 12px;
  font-size: 22px;
  font-family: 'Orbitron', sans-serif;
  color: #ffffff;
  padding: 14px 20px;
  border: none;
  font-weight: 700;
  cursor: pointer;
`

interface ISubmitButton {}

const SubmitButton: React.FC<ISubmitButton> = ({}) => {
  const [isAddEntryModalOpen, toggleAddEntryModal] = useToggle(false)

  return (
    <>
      {' '}
      <StyledButton onClick={toggleAddEntryModal}>Submit entry</StyledButton>
      {isAddEntryModalOpen && (
        <AddEntryModal toggleAddEntryModal={toggleAddEntryModal} />
      )}
    </>
  )
}
export default SubmitButton
