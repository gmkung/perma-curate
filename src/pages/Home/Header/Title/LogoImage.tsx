import React from 'react'
import styled from 'styled-components'
import KlerosLogo from 'tsx:svgs/header/kleros-pnk-logo.svg'

const StyledKlerosLogo = styled(KlerosLogo)`
  height: 48px;
`

const LogoImage: React.FC = () => {
  return <StyledKlerosLogo />
}
export default LogoImage
