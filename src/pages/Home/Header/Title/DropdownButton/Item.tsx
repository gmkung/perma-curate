import React, { Dispatch, SetStateAction } from 'react'
import styled, { css } from 'styled-components'

const dropdownStyles = css`
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
`

const Container = styled.button`
  ${dropdownStyles}
  display: block;
  width: 100%;
  text-align: left;
  background-color: white;
  color: #2d3748;
  transition: background-color 0.3s ease;
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px 0px rgba(0, 0, 0, 0);

  &:hover {
    background-color: #e2e8f0;
  }
`

interface IItem {
  setActiveList: Dispatch<SetStateAction<string>>
  toggleDropdown: () => void
  name: string
}

const Item: React.FC<IItem> = ({ setActiveList, toggleDropdown, name }) => {
  return (
    <Container
      key={name}
      onClick={() => {
        setActiveList(name)
        toggleDropdown()
      }}
    >
      {name}
    </Container>
  )
}
export default Item
