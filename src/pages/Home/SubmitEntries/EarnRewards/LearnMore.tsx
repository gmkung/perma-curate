import React from 'react'
import styled from 'styled-components'

const StyledA = styled.a`
  font-size: 16px;
  color: #9c46ff;
  text-decoration: underline;
  align-self: flex-end;
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
