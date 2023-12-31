import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import Button from 'components/Button'
import { useSearchParams } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 48px auto 0;
  display: flex;
  gap: 12px;
  align-items: center;

  ${landscapeStyle(
    () => css`
      flex-direction: row;
      justify-content: space-between;
    `
  )}
`

const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const Input = styled.input`
  width: 64px;
  padding: 8px;
  border-radius: 8px 0 0 8px;
  outline: none;
  border: 2px solid #805ad5;
  color: #2d3748;
`

const Span = styled.span`
  color: white;
`

interface IPagination {
  totalPages: number | null
}

const Pagination: React.FC<IPagination> = ({ totalPages }) => {
  let [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page'))

  const [pageInput, setPageInput] = useState<number>(page)

  useEffect(() => {
    setPageInput(Number(searchParams.get('page')))
  }, [searchParams])

  const setCurrentPage = (page: number) => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.delete('page')
      newParams.append('page', String(page))
      return newParams
    })
  }
  return (
    <Container>
      <Button
        onClick={() => setCurrentPage(page - 1)}
        disabled={page <= 1}
        style={{ cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
      >
        Previous
      </Button>
      <PageControls>
        <Input
          type="number"
          value={pageInput}
          onChange={(e) =>
            setPageInput(
              Math.min(
                Math.max(1, parseInt(e.target.value)),
                totalPages || Infinity
              )
            )
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter') setCurrentPage(pageInput)
          }}
        />
        <Span>of {totalPages === null ? '???' : totalPages}</Span>
        <Button onClick={() => setCurrentPage(pageInput)}>Go</Button>
      </PageControls>
      <Button
        onClick={() => setCurrentPage(page + 1)}
        disabled={page >= (totalPages || Infinity)}
        style={{
          cursor: page >= (totalPages || Infinity) ? 'not-allowed' : 'pointer',
        }}
      >
        Next
      </Button>
    </Container>
  )
}

export default Pagination
