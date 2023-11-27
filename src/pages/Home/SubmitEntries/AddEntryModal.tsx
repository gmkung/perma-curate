import React, { useRef } from 'react'
import styled from 'styled-components'
import { useFocusOutside } from 'hooks/useFocusOutside'

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
  position: relative;
  overflow-y: auto;
`

interface IAddEntryModal {
  toggleAddEntryModal: () => void
}

const AddEntryModal: React.FC<IAddEntryModal> = ({ toggleAddEntryModal }) => {
  const containerRef = useRef(null)
  useFocusOutside(containerRef, () => toggleAddEntryModal())

  return (
    <ModalOverlay>
      <ModalContainer ref={containerRef}>hi</ModalContainer>
    </ModalOverlay>
  )
}

export default AddEntryModal
