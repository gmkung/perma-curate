import React from 'react'
import styled from 'styled-components'

const StyledText = styled.text`
  font-size: 48px;
  text-align: center;
  font-family: 'Orbitron', sans-serif;
`

interface IProductName {}

const ProductName: React.FC<IProductName> = ({}) => {
  return <StyledText>Kleros Scout</StyledText>
}
export default ProductName
