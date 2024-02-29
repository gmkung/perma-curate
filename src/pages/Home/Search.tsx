import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { responsiveSize } from 'styles/responsiveSize'
import { useSearchParams } from 'react-router-dom'
import { useDebounce } from 'react-use'

const Container = styled.div`
  display: flex;
  width: 84vw;
  margin-bottom: ${responsiveSize(4, 8)};
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
  max-width: 80px;
  background-color: #883ae1;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  font-size: 20px;
  padding: ${responsiveSize(8, 16)} ${responsiveSize(16, 32)};
  border-radius: 12px 12px 0 0;
  color: white;

  ${landscapeStyle(
    () => css`
      border-radius: 12px 0 0 12px;
    `
  )}
`

const StyledInput = styled.input`
  display: flex;
  padding: ${responsiveSize(8, 12)};
  padding-left: ${responsiveSize(16, 24)};
  outline: none;
  border: 2px solid #805ad5;
  border-left: 0;
  color: #2d3748;
  border-radius: 12px;
  border-radius: 0 12px 12px 12px;
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
      border-radius: 0 12px 12px 0;
    `
  )}
`

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState<string>('')
  // prevent rebouncing if search was already applied
  const [appliedSearch, setAppliedSearch] = useState<boolean>(true)

  useEffect(() => {
    setSearchTerm(searchParams.get('text') || '')
    setAppliedSearch(true)
  }, [searchParams])

  const applySearch = () => {
    if (!appliedSearch) {
      setSearchParams((prev) => {
        const prevParams = prev.toString()
        const newParams = new URLSearchParams(prevParams)
        newParams.delete('text')
        newParams.append('text', searchTerm)
        // bounce to page 1
        newParams.delete('page')
        newParams.append('page', '1')
        return newParams
      })
      setAppliedSearch(true)
    }
  }
  useDebounce(
    () => {
      applySearch()
    },
    500,
    [searchTerm]
  )

  const changeSearchTerm = (text: string) => {
    setAppliedSearch(false)
    setSearchTerm(text)
  }

  return (
    <Container>
      <StyledLabel>Search</StyledLabel>
      <StyledInput
        type="text"
        value={searchTerm}
        onChange={(e) => changeSearchTerm(e.target.value)}
        placeholder="Enter keywords, Ethereum address, etc..."
      />
    </Container>
  )
}

export default Search
