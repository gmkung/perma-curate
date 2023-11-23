import React, { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  width: 80%;
  margin: 48px auto 0;
  display: flex;
  justify-content: space-between;
`

const Button = styled.button`
  background-color: #805ad5;
  padding: 8px 16px;
  border-radius: 12px;
  &:hover {
    background-color: #6b46c1;
  }
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
  color: #718096;
`

interface IPagination {
  totalPages: number
  setCurrentPage: Dispatch<SetStateAction<number>>
}

const Pagination: React.FC<IPagination> = ({ totalPages, setCurrentPage }) => {
  const [pageInput, setPageInput] = useState<number>(1)

  return (
    <Container>
      <Button onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}>
        Previous
      </Button>
      <PageControls>
        <Input
          type="number"
          value={pageInput}
          onChange={(e) =>
            setPageInput(
              Math.min(Math.max(1, parseInt(e.target.value)), totalPages)
            )
          }
        />
        <Span>of {totalPages}</Span>
        <Button onClick={() => setCurrentPage(pageInput)}>Go</Button>
      </PageControls>
      <Button
        onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
      >
        Next
      </Button>
    </Container>
  )
}

export default Pagination
