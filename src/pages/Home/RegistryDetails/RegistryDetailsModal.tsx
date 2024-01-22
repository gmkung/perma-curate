import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'
import { useFocusOutside } from 'hooks/useFocusOutside'
import { useQuery } from '@tanstack/react-query'
import { FocusedRegistry, fetchItemCounts } from '~src/utils/itemCounts'

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
  background-color: #984ae1;
  border-radius: 12px;
  width: 75%;
  height: 75%;
  position: relative;
  color: #4a5568;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  align-items: center;
`

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 10;
`

const StyledLabel = styled.div`
  font-size: 20px;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  color: black;
`

const RegistryDetailsModal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    isLoading: countsLoading,
    error: countsError,
    data: countsData,
  } = useQuery({
    queryKey: ['counts'],
    queryFn: () => fetchItemCounts(),
  })

  const registry: FocusedRegistry | undefined = useMemo(() => {
    const registryLabel = searchParams.get('registry')
    if (registryLabel === null || !countsData) return undefined
    return countsData[registryLabel]
  }, [searchParams, countsData])

  const closeModal = () => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.delete('registrydetails')
      return newParams
    })
  }
  const containerRef = useRef(null)
  useFocusOutside(containerRef, () => closeModal())

  return (
    <ModalOverlay>
      <ModalContainer ref={containerRef}>
        {registry && (
          <>
            <StyledLabel>Title: {registry.metadata.tcrTitle}</StyledLabel>
            <StyledLabel>
              Address:{' '}
              <a
                href={`https://gnosisscan.io/address/${registry.metadata.address}`}
              >
                {registry.metadata.address}
              </a>
            </StyledLabel>
            <StyledLabel>
              Policy:{' '}
              <a href={`https://ipfs.kleros.io${registry.metadata.policyURI}`}>
                Link
              </a>
            </StyledLabel>
            <img
              style={{ marginTop: 50 }}
              height={300}
              src={`https://ipfs.kleros.io${registry.metadata.logoURI}`}
            ></img>
          </>
        )}

        <CloseButton
          onClick={() => {
            closeModal()
          }}
        >
          X
        </CloseButton>
      </ModalContainer>
    </ModalOverlay>
  )
}

export default RegistryDetailsModal
