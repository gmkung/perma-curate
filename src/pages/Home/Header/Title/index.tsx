import React, { Dispatch, SetStateAction } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import DropdownButton from './DropdownButton'
import LogoImage from './LogoImage'
import ProductName from './ProductName'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;

  ${landscapeStyle(
    () => css`
      flex-direction: row;
    `
  )}
`

interface ITitle {
  activeList: string
  setActiveList: Dispatch<SetStateAction<string>>
}

const index: React.FC<ITitle> = ({ activeList, setActiveList }) => {
  return (
    <Container>
      <LogoImage />
      <ProductName />
      <DropdownButton activeList={activeList} setActiveList={setActiveList} />
    </Container>
  )
}
export default index
