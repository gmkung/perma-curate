import React from 'react'
import styled from 'styled-components'
import { references } from 'utils/chains'
import { chainColorMap } from 'utils/colorMappings'

const Container = styled.div`
  margin-top: 4px;
`

const StyledSpan = styled.span<{ bgColor: string }>`
  padding: 1px 4px;
  color: white;
  border-radius: 4px;
  background-color: ${(props) => props.bgColor};
`

const truncateAddress = (addr: string) => {
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
}

interface IAddressDisplay {
  address: string
}

const AddressDisplay: React.FC<IAddressDisplay> = ({ address }) => {
  const parts = address.split(':')
  const keyForReference = `${parts[0]}:${parts[1]}`
  const reference = references.find(
    (ref) => `${ref.namespaceId}:${ref.id}` === keyForReference
  )
  const bgColor = chainColorMap[keyForReference] || '#a0aec0'

  return (
    <Container>
      {truncateAddress(parts[2]) + ' '}
      <StyledSpan bgColor={bgColor}>{reference?.label}</StyledSpan>
    </Container>
  )
}

export default AddressDisplay
