import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { responsiveSize } from 'styles/responsiveSize'
import { useDebounce } from 'react-use'
import { useSearchParams } from 'react-router-dom'
import SearchIcon from 'tsx:svgs/icons/search.svg'

const Container = styled.div`
  display: flex;
  align-items: center;
  background: #855caf;
  border-radius: 12px;
  padding-left: ${responsiveSize(12, 20)};
  width: 100%;

  ${landscapeStyle(
    () => css`
      width: 560px;
    `
  )}

  svg {
    flex-shrink: 0;
  }
`

const StyledInput = styled.input`
  flex-grow: 1;
  padding: 8px;
  background: transparent;
  font-family: 'Oxanium', sans-serif;
  font-weight: 700;
  font-size: 18px;
  outline: none;
  border: none;
  color: #fff;
  border-radius: 12px;

  ::placeholder {
    font-weight: 700;
    color: #cd9dff;
  }
`

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchTerm, setSearchTerm] = useState<string>('')
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
      <SearchIcon />
      <StyledInput
        type="text"
        value={searchTerm}
        onChange={(e) => changeSearchTerm(e.target.value)}
        placeholder="Search with keywords, ethereum address, etc."
      />
    </Container>
  )
}

export default Search
