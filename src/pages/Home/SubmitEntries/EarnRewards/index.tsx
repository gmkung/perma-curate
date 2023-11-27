import React from 'react'
import styled from 'styled-components'
import LearnMore from './LearnMore'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`

interface IEarnRewards {}

const EarnRewards: React.FC<IEarnRewards> = ({}) => {
  return (
    <Container>
      <text>{`Submit & earn rewards`}</text>
      <LearnMore />
    </Container>
  )
}
export default EarnRewards
