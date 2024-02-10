import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'
import { useFocusOutside } from 'hooks/useFocusOutside'
import { useSearchParams } from 'react-router-dom'

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

const AddEntryModal: React.FC = () => {
  const containerRef = useRef(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const addingItemToRegistry = useMemo(() => searchParams.get('additem'), [searchParams])

  const closeModal = () => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.delete('additem')
      return newParams
    })
  }

  useFocusOutside(containerRef, () => closeModal())

  return (
    <ModalOverlay>
      <ModalContainer ref={containerRef}></ModalContainer>
    </ModalOverlay>
  )
}

export default AddEntryModal
