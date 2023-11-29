import React, { Dispatch, SetStateAction } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'

const Container = styled.div`
  display: flex;
  width: 84vw;
  margin-bottom: 24px;
  flex-direction: column;

  ${landscapeStyle(
    () => css`
      width: 80%;
      flex-direction: row;
    `
  )}
`

const StyledLabel = styled.label`
  display: flex;
  background-color: #883ae1;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  font-size: 20px;
  padding: 16px 32px;
  border-radius: 12px;
  color: white;

  ${landscapeStyle(
    () => css`
      border-radius: 12px 0 0 12px;
    `
  )}
`

const StyledInput = styled.input`
  display: flex;
  padding: 12px;
  outline: none;
  border: 2px solid #805ad5;
  border-left: 0;
  color: #2d3748;
  border-radius: 12px;
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 700;
  ::placeholder {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #c7c7c7;
  }

  ${landscapeStyle(
    () => css`
      width: 100%;
      padding-left: 24px;
      border-radius: 0 12px 12px 0;
    `
  )}
`

interface ISearch {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}

const Search: React.FC<ISearch> = ({ searchTerm, setSearchTerm }) => {
  return (
    <Container>
      <StyledLabel>Search</StyledLabel>
      <StyledInput
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter keywords, Ethereum address, etc..."
      />
    </Container>
  )
}

export default Search
