import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { calcMinMax } from 'utils/calcMinMax'
import EarnRewards from './EarnRewards'
import SuggestAndSubmit from './SuggestAndSubmit'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 84vw;
  align-items: flex-start;
  border-radius: 12px;
  background: #380c65;
  padding: 8px ${calcMinMax(8, 12)};
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  justify-content: space-between;
  font-size: 22px;
  box-sizing: border-box;
  flex-wrap: wrap;
  gap: 16px;

  ${landscapeStyle(
    () => css`
      width: 80%;
      align-items: center;
    `
  )}
`

const SubmitEntries: React.FC = () => {
  return (
    <Container>
      <EarnRewards />
      <SuggestAndSubmit />
    </Container>
  )
}
export default SubmitEntries
