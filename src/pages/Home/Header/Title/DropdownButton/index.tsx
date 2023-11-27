import React, { Dispatch, SetStateAction } from 'react'
import styled, { css } from 'styled-components'
import { useToggle } from 'react-use'
import Menu from './Menu'

const dropdownStyles = css`
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  border: none;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
`

const StyledButton = styled.button<{ open: boolean }>`
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

interface IDropdownButton {
  activeList: string
  setActiveList: Dispatch<SetStateAction<string>>
}

const DropdownButton: React.FC<IDropdownButton> = ({
  activeList,
  setActiveList,
}) => {
  const [isDropdownOpen, toggleDropdown] = useToggle(false)

  return (
    <StyledButton open={isDropdownOpen} onClick={() => toggleDropdown()}>
      {activeList}
      {isDropdownOpen && (
        <Menu toggleDropdown={toggleDropdown} setActiveList={setActiveList} />
      )}
    </StyledButton>
  )
}
export default DropdownButton
