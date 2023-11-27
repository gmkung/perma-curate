import React from 'react'
import styled from 'styled-components'
import EarnRewards from './EarnRewards'
import SuggestAndSubmit from './SuggestAndSubmit'

const Container = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 24px;
  align-items: center;
  border-radius: 12px;
  background: #380c65;
  padding: 20px 32px 20px 20px;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  justify-content: space-between;
  font-size: 22px;
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
    <>
      <Container>
        <EarnRewards />
        <SuggestAndSubmit />
      </Container>
    </>
  )
}
export default SubmitEntries
