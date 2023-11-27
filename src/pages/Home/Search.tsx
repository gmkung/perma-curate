import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

const SearchContainer = styled.div`
  width: 80%;
  margin: auto;
  display: flex;
  align-items: center;
  padding-bottom: 8px;
`

const Label = styled.label`
  background-color: #805ad5;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: 12px 0 0 12px;
  color: white;
`

const Input = styled.input`
  flex-grow: 1;
  padding: 8px;
  outline: none;
  border: 2px solid #805ad5;
  border-left: 0;
  color: #2d3748;
  border-radius: 0 12px 12px 0;
`

interface ISearch {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}

const Search: React.FC<ISearch> = ({ searchTerm, setSearchTerm }) => {
  return (
    <SearchContainer>
      <Label>Search</Label>
      <Input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter keywords, Ethereum addresses..."
      />
    </SearchContainer>
  )
}

export default Search
