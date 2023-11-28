import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  width: 80%;
  margin-bottom: 24px;

  box-sizing: border-box;
`

const StyledLabel = styled.label`
  display: flex;
  background-color: #883ae1;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  font-size: 20px;
  padding: 16px 32px;
  border-radius: 12px 0 0 12px;
  color: white;
`

const StyledInput = styled.input`
  display: block;
  padding-left: 24px;
  outline: none;
  border: 2px solid #805ad5;
  border-left: 0;
  color: #2d3748;
  border-radius: 0 12px 12px 0;
  width: 100%;
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 700;
  ::placeholder {
    font-family: 'Orbitron', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #c7c7c7;
  }
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
