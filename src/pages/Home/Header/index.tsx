import React from 'react'
import styled from 'styled-components'
import { responsiveSize } from 'styles/responsiveSize'
import Title from './Title'

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
  margin-bottom: ${responsiveSize(12, 16)};
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
