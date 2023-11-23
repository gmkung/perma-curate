import React from 'react'
import { GlobalStyle } from 'styles/global-style'

const StyledComponentsProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <>
      <GlobalStyle />
      {children}
    </>
  )
}

export default StyledComponentsProvider
