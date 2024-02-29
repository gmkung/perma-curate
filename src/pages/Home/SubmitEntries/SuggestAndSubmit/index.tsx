import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import SubmitButton from './SubmitButton'
import Suggest from './Suggest'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex-wrap: wrap;

  ${landscapeStyle(
    () => css`
      flex-direction: row;
    `
  )}
`

const SuggestAndSubmit: React.FC = () => {
  return (
    <Container>
      <Suggest />
      <SubmitButton />
    </Container>
  )
}
export default SuggestAndSubmit
