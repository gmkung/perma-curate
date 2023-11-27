import React from 'react'
import styled from 'styled-components'

const StyledText = styled.text`
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 700;
  align-self: center;
  text-decoration: underline;
`

interface ISuggest {}

const Suggest: React.FC<ISuggest> = ({}) => {
  return <StyledText>Suggest entry</StyledText>
}
export default Suggest
