import React from 'react'
import styled from 'styled-components'
import Title from './Title'
import { calcMinMax } from 'utils/calcMinMax'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const StyledText = styled.text`
  font-size: 16px;
  font-family: 'Orbitron', sans-serif;
  text-align: center;
  color: #d6d6d6;
  margin-bottom: ${calcMinMax(12, 16)};
`

const Header: React.FC = () => {
  return (
    <Container>
      <Title />
      <StyledText>
        Crowdsourced contract metadata for the Ethereum ecosystem.
      </StyledText>
    </Container>
  )
}

export default Header
