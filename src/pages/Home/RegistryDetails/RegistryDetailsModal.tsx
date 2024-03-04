import React, { useMemo, useRef, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { responsiveSize } from 'styles/responsiveSize'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { FocusedRegistry, fetchItemCounts } from 'utils/itemCounts'
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
  display: flex;
  background-color: #5a2393;
  border-radius: 12px;
  width: 84vw;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding-top: 24px;
  padding-bottom: 24px;

  ${landscapeStyle(
    () => css`
      width: 43%;
    `
  )}
`

const StyledLabel = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  padding: 0 ${responsiveSize(16, 32)};
`

const StyledA = styled.a`
  display: flex;
  justify-content: center;
  width: 100%;
  word-break: break-word;
  color: #add8e6;
`

const StyledImg = styled.img`
  height: 200px;
  width: 200px;
`

const RegistryDetailsModal: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [imgLoaded, setImgLoaded] = useState(false)

  const {
    isLoading: countsLoading,
    error: countsError,
    data: countsData,
  } = useQuery({
    queryKey: ['counts'],
    queryFn: () => fetchItemCounts(),
    staleTime: Infinity,
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
      {registry && (
        <ModalContainer ref={containerRef}>
          <StyledLabel>Title: {registry.metadata.tcrTitle}</StyledLabel>
          <StyledLabel>
            Address:{' '}
            <StyledA
              href={`https://gnosisscan.io/address/${registry.metadata.address}`}
              target="_blank"
            >
              {registry.metadata.address}
            </StyledA>
          </StyledLabel>
          <StyledLabel>
            Policy:{' '}
            <StyledA
              href={`https://ipfs.kleros.io${registry.metadata.policyURI}`}
              target="_blank"
            >
              Link
            </StyledA>
          </StyledLabel>
          {!imgLoaded && <Skeleton height={200} width={200} />}
          <StyledImg
            src={`https://ipfs.kleros.io${registry.metadata.logoURI}`}
            onLoad={() => setImgLoaded(true)}
            style={{ display: imgLoaded ? 'block' : 'none' }}
          ></StyledImg>
        </ModalContainer>
      )}
    </ModalOverlay>
  )
}

export default RegistryDetailsModal
