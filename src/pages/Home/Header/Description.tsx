import React from 'react'
import styled from 'styled-components'

const StyledText = styled.text`
  font-size: 20px;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
  color: #d6d6d6;
  margin-bottom: 34px;
`

const Description: React.FC = () => {
  return (
    <StyledText>
      Crowdsourced contract metadata for the Ethereum ecosystem.
    </StyledText>
  )
}

export default Description
