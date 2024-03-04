import React from 'react'
import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'
import Button from 'components/Button'

const StyledButton = styled(Button)`
  align-items: center;
  font-family: 'Avenir', sans-serif;
  background: #855caf;
`

const RegistryDetailsButton: React.FC = () => {
  const [, setSearchParams] = useSearchParams()
  const openModal = () => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.append('registrydetails', 'true')
      return newParams
    })
  }

  return <StyledButton onClick={openModal}>Registry Details</StyledButton>
}

export default RegistryDetailsButton
