import React from 'react'
import { useSearchParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 32px;
  position: relative;

  ${landscapeStyle(
    () => css`
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    `
  )}
`

const StyledItem = styled.div<{ isSelected: boolean }>`
  text-decoration: ${({ isSelected }) => (isSelected ? 'underline' : 'none')};
  font-weight: ${({ isSelected }) => (isSelected ? 600 : 400)};
  font-family: 'Oxanium', sans-serif;
  cursor: pointer;
`

interface IItem {
  name: string
}

const Item: React.FC<IItem> = ({ name }) => {
  let [searchParams, setSearchParams] = useSearchParams()
  const isSelected = searchParams.get('registry') === name

  const handleItemClick = (event) => {
    event.stopPropagation()
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev.toString())
      newParams.set('registry', name)
      // bounce to page 1
      newParams.set('page', '1')
      return newParams
    })
  }

  return (
    <StyledItem key={name} onClick={handleItemClick} isSelected={isSelected}>
      {name}
    </StyledItem>
  )
}

const ITEMS = [{ name: 'Tags' }, { name: 'Tokens' }, { name: 'CDN' }]

const Registries: React.FC = () => {
  return (
    <Container>
      {ITEMS.map((item) => (
        <Item key={item.name} name={item.name} />
      ))}
    </Container>
  )
}
export default Registries
