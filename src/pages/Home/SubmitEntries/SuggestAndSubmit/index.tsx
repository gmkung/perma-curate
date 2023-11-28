import React from 'react'
import styled from 'styled-components'
import SubmitButton from './SubmitButton'
import Suggest from './Suggest'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 28px;
`

interface ISuggestAndSubmit {
  activeList: string
}

const SuggestAndSubmit: React.FC<ISuggestAndSubmit> = ({ activeList }) => {
  return (
    <Container>
      <Suggest activeList={activeList} />
      <SubmitButton />
    </Container>
  )
}
export default SuggestAndSubmit
