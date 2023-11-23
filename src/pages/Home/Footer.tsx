import React from 'react'
import styled from 'styled-components'

const StyledFooter = styled.footer`
  margin-top: 64px;
  text-align: center;
  color: #9f7aea;
  font-size: 14px;
`

const Footer: React.FC = () => {
  return <StyledFooter>© 2023 Kleros Tags. All rights reserved.</StyledFooter>
}

export default Footer
