import React, { Dispatch, SetStateAction, useRef } from 'react'
import { useFocusOutside } from 'hooks/useFocusOutside'
import styled, { css } from 'styled-components'

interface IHeader {
  activeList: string
  registryDropdownOpen: boolean
  setRegistryDropdownOpen: Dispatch<SetStateAction<boolean>>
  setActiveList: Dispatch<SetStateAction<string>>
}

const HeaderContainer = styled.div`
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  font-family: "Orbitron", sans-serif;
`

const dropdownStyles = css`
  border-radius: 16px; /* More pronounced rounded corners */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Soft shadow for depth */
  border: none;
  font-size: 16px;
  padding: 10px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
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
  background: linear-gradient(145deg, #9575cd, #6c43ab); /* Subtle gradient */
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  color: white;

  &:hover {
    background: linear-gradient(145deg, #a188d6, #7e57c2); /* Darker gradient for hover */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); /* Larger shadow for lifted effect */
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
  box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0),
    0px 0px 0px 0px rgba(0, 0, 0, 0);

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
      Kleros
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
