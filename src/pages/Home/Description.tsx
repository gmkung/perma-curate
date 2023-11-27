import React from 'react'
import styled from 'styled-components'

const StyledP = styled.p`
  font-size: 20px;
  font-family: "Orbitron", sans-serif;
  text-align: center;
  color: #9f7aea;
  margin-bottom: 48px;
`

interface IDescription {}

const Description: React.FC<IDescription> = ({}) => {
  return (
    <StyledP>
      Crowdsourced contract metadata for the Ethereum ecosystem.
    </StyledP>
  )
}

export default Description
