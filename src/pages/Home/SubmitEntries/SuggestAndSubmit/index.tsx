import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import SubmitButton from './SubmitButton'
import Suggest from './Suggest'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  flex-wrap: wrap;

  ${landscapeStyle(
    () => css`
      flex-direction: row;
    `
  )}
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
