import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

interface IHeader {
  activeList: string
  registryDropdownOpen: boolean
  setRegistryDropdownOpen: Dispatch<SetStateAction<boolean>>
  setActiveList: Dispatch<SetStateAction<string>>
}

const HeaderContainer = styled.h1`
  font-size: 48px;
  text-align: center;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const LogoImage = styled.img`
  margin-right: 16px;
  height: 48px;
`

const DropdownButton = styled.button`
  position: relative;
  font-weight: bold;
`

const DropdownMenu = styled.div`
  position: absolute;
  z-index: 10;
  margin-top: 8px;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1),
    0px 4px 6px -2px rgba(0, 0, 0, 0.05);
`

const DropdownItem = styled.button`
  display: block;
  padding: 4px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  &:hover {
    background-color: #f7fafc;
  }
`

const Header: React.FC<IHeader> = ({
  activeList,
  registryDropdownOpen,
  setRegistryDropdownOpen,
  setActiveList,
}) => {
  return (
    <HeaderContainer>
      <LogoImage
        src="https://cryptologos.cc/logos/kleros-pnk-logo.svg?v=026"
        alt="Kleros"
      />
      Kleros {' {'}
      <DropdownButton
        onClick={() => setRegistryDropdownOpen(!registryDropdownOpen)}
      >
        {activeList}
        {'}'}
      </DropdownButton>
      {registryDropdownOpen && (
        <DropdownMenu>
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
    </HeaderContainer>
  )
}

export default Header
