import React, { Dispatch, SetStateAction, useRef } from 'react'
import { useFocusOutside } from 'hooks/useFocusOutside'
import styled, { css } from 'styled-components'

interface IHeader {
  activeList: string
  registryDropdownOpen: boolean
  setRegistryDropdownOpen: Dispatch<SetStateAction<boolean>>
  setActiveList: Dispatch<SetStateAction<string>>
}

const dropdownStyles = css`
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border: none;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
`

const HeaderContainer = styled.div`
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`

const LogoImage = styled.img`
  height: 48px;
`

const DropdownButton = styled.button<{ open: boolean }>`
  ${dropdownStyles}
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: bold;
  position: relative;
  background-color: ${(props) => (props.open ? '#365f8c' : '#4f46e5')};
  color: white;

  &:hover {
    background-color: #365f8c;
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

const DropdownMenu = styled.div`
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

const DropdownItem = styled.button`
  ${dropdownStyles}
  display: block;
  width: 100%;
  text-align: left;
  background-color: white;
  color: #2d3748;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e2e8f0;
  }
`

const Header: React.FC<IHeader> = ({
  activeList,
  registryDropdownOpen,
  setRegistryDropdownOpen,
  setActiveList,
}) => {
  const containerRef = useRef(null)
  useFocusOutside(containerRef, () => setRegistryDropdownOpen(false))

  return (
    <HeaderContainer>
      <LogoImage
        src="https://cryptologos.cc/logos/kleros-pnk-logo.svg?v=026"
        alt="Kleros"
      />
      Kleros Scout
      <DropdownButton
        open={registryDropdownOpen}
        onClick={() => setRegistryDropdownOpen(!registryDropdownOpen)}
      >
        {activeList}
        {registryDropdownOpen && (
          <DropdownMenu ref={containerRef}>
            <DropdownItem
              onClick={() => {
                setActiveList('Tags')
                setRegistryDropdownOpen(false)
              }}
            >
              Tags
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setActiveList('CDN')
                setRegistryDropdownOpen(false)
              }}
            >
              CDN
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setActiveList('Tokens')
                setRegistryDropdownOpen(false)
              }}
            >
              Tokens
            </DropdownItem>
          </DropdownMenu>
        )}
      </DropdownButton>
    </HeaderContainer>
  )
}

export default Header
