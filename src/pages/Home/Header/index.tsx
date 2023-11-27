import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import Description from './Description'
import Title from './Title'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

interface IHeader {
  activeList: string
  setActiveList: Dispatch<SetStateAction<string>>
}

const Header: React.FC<IHeader> = ({ activeList, setActiveList }) => {
  return (
    <Container>
      <Title activeList={activeList} setActiveList={setActiveList} />
      <Description />
    </Container>
  )
}

export default Header
