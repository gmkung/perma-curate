import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import DropdownButton from './DropdownButton'
import KlerosLogo from 'tsx:svgs/header/kleros-pnk-logo.svg'

const StyledKlerosLogo = styled(KlerosLogo)`
  height: 48px;
`

const StyledText = styled.text`
  font-size: 48px;
  text-align: center;
  font-family: 'Orbitron', sans-serif;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;

  ${landscapeStyle(
    () => css`
      flex-direction: row;
    `
  )}
`

const Title: React.FC = () => {
  return (
    <Container>
      <StyledKlerosLogo />
      <StyledText>Kleros Scout</StyledText>
      <DropdownButton />
    </Container>
  )
}
export default Title
