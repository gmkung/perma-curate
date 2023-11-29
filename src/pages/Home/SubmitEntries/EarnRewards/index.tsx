import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import LearnMore from './LearnMore'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  ${landscapeStyle(
    () => css`
      flex-direction: row;
    `
  )}
`

const StyledText = styled.text`
  display: flex;
`

interface IEarnRewards {}

const EarnRewards: React.FC<IEarnRewards> = ({}) => {
  return (
    <Container>
      <StyledText>{`Submit & earn rewards`}</StyledText>
      <LearnMore />
    </Container>
  )
}
export default EarnRewards
