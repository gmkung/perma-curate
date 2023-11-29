import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import EarnRewards from './EarnRewards'
import SuggestAndSubmit from './SuggestAndSubmit'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 84vw;
  align-items: flex-start;
  margin-bottom: 24px;
  border-radius: 12px;
  background: #380c65;
  padding: 16px 32px;
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
      flex-direction: row;
      align-items: center;
    `
  )}
`

interface ISubmitEntries {
  activeList: any
  depositParams: any
  curateContractAddress: string
}

const SubmitEntries: React.FC<ISubmitEntries> = ({
  activeList,
  depositParams,
  curateContractAddress,
}) => {
  return (
    <Container>
      <EarnRewards />
      <SuggestAndSubmit activeList={activeList} />
    </Container>
  )
}
export default SubmitEntries
