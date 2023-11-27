import React from 'react'
import styled from 'styled-components'

const StyledImage = styled.img`
  height: 48px;
`

const LogoImage: React.FC = () => {
  return (
    <StyledImage
      src="https://cryptologos.cc/logos/kleros-pnk-logo.svg?v=026"
      alt="Kleros"
    />
  )
}
export default LogoImage
