import React from 'react'
import styled from 'styled-components'
import { calcMinMax } from 'utils/calcMinMax'

const StyledText = styled.text`
  font-size: 20px;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
  color: #d6d6d6;
  margin-bottom: ${calcMinMax(24, 34)};
`

const Description: React.FC = () => {
  return (
    <StyledText>
      Crowdsourced contract metadata for the Ethereum ecosystem.
    </StyledText>
  )
}

export default Description
