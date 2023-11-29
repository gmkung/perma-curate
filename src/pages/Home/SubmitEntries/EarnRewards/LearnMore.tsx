import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'

const StyledA = styled.a`
  font-size: 16px;
  color: #9c46ff;
  text-decoration: underline;

  ${landscapeStyle(
    () => css`
      align-self: flex-end;
    `
  )}
`

interface ILearnMore {}

const LearnMore: React.FC<ILearnMore> = ({}) => {
  return (
    <StyledA
      href="https://blog.kleros.io/renewing-the-combined-incentive-program-for-curate/"
      rel="noreferrer noopener"
      target="_blank"
    >
      Learn more
    </StyledA>
  )
}
export default LearnMore
