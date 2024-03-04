import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { responsiveSize } from 'styles/responsiveSize'
import EarnRewards from './EarnRewards'
import SuggestAndSubmit from './SuggestAndSubmit'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  border-radius: 12px;
  background: #380c65;
  padding: ${responsiveSize(16, 7)} 7px ${responsiveSize(16, 7)}
    ${responsiveSize(16, 32)};
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  font-size: 22px;
  box-sizing: border-box;
  flex-wrap: wrap;
  gap: 16px;

  ${landscapeStyle(
    () => css`
      width: 65%;
      align-items: center;
      justify-content: space-between;
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
