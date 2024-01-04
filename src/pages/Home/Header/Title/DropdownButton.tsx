import React, { useRef } from 'react'
import styled, { css } from 'styled-components'
import { useToggle } from 'react-use'
import { useSearchParams } from 'react-router-dom'
import { useFocusOutside } from 'hooks/useFocusOutside'

const dropdownStyles = css`
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
`

interface IButton {
  open: boolean
}

const StyledButton = styled.button<IButton>`
  ${dropdownStyles}
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  position: relative;
  background: linear-gradient(145deg, #9575cd, #6c43ab);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  color: white;

  &:hover {
    background: linear-gradient(145deg, #a188d6, #7e57c2);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  &:after {
    content: '';
    border: solid white;
    border-width: 0 2px 2px 0;
    display: inline-block;
    padding: 3px;
    margin-left: 10px;
    transform: ${(props) => (props.open ? 'rotate(-135deg)' : 'rotate(45deg)')};
    transition: transform 0.3s ease;
  }
`

const ItemContainer = styled.button`
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
  toggleDropdown: () => void
  name: string
}

const Item: React.FC<IItem> = ({ toggleDropdown, name }) => {
  let [, setSearchParams] = useSearchParams()
  const handleItemClick = (event) => {
    event.stopPropagation()
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.delete('registry')
      newParams.append('registry', name)
      // bounce to page 1
      newParams.delete('page')
      newParams.append('page', '1')
      return newParams
    })
    toggleDropdown()
  }

  return (
    <ItemContainer key={name} onClick={handleItemClick}>
      {name}
    </ItemContainer>
  )
}

const MenuContainer = styled.div`
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
}

const Menu: React.FC<IMenu> = ({ toggleDropdown }) => {
  const containerRef = useRef(null)
  useFocusOutside(containerRef, () => toggleDropdown())

  return (
    <MenuContainer ref={containerRef}>
      {ITEMS.map(({ name }) => (
        <Item toggleDropdown={toggleDropdown} name={name} />
      ))}
    </MenuContainer>
  )
}

const DropdownButton: React.FC = () => {
  const [isDropdownOpen, toggleDropdown] = useToggle(false)
  let [searchParams] = useSearchParams()
  const activeList = searchParams.get('registry')

  return (
    <StyledButton open={isDropdownOpen} onClick={() => toggleDropdown()}>
      {activeList}
      {isDropdownOpen && <Menu toggleDropdown={toggleDropdown} />}
    </StyledButton>
  )
}
export default DropdownButton
