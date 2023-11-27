import React, { Dispatch, SetStateAction, useRef } from 'react'
import styled from 'styled-components'
import { useFocusOutside } from 'hooks/useFocusOutside'
import Item from './Item'

const Container = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  margin-top: 8px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1),
    0px 4px 6px -2px rgba(0, 0, 0, 0.05);
`

const ITEMS = [{ name: 'Tags' }, { name: 'CDN' }, { name: 'Tokens' }]

interface IMenu {
  toggleDropdown: () => void
  setActiveList: Dispatch<SetStateAction<string>>
}

const Menu: React.FC<IMenu> = ({ toggleDropdown, setActiveList }) => {
  const containerRef = useRef(null)
  useFocusOutside(containerRef, () => toggleDropdown())

  return (
    <Container ref={containerRef}>
      {ITEMS.map(({ name }) => (
        <Item
          toggleDropdown={toggleDropdown}
          setActiveList={setActiveList}
          name={name}
        />
      ))}
    </Container>
  )
}
export default Menu
