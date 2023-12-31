import React from 'react'
import styled from 'styled-components'

const StyledP = styled.p<{ isExpanded: boolean }>`
  display: flex;
  font-size: 20px;
  color: #d6d6d6;
  margin: 0;
  ${({ isExpanded }) => isExpanded && 'margin-top: 16px'}
`

interface ITotalEntries {
  loading: boolean
  itemCount: number | null
  isExpanded: boolean
}

const TotalEntries: React.FC<ITotalEntries> = ({
  loading,
  itemCount,
  isExpanded,
}) => {
  return (
    <StyledP isExpanded={isExpanded}>
      Total entries:{' '}
      {loading ? (
        <i>&nbsp;calculating...</i>
      ) : itemCount === null ? (
        '???'
      ) : (
        itemCount
      )}
    </StyledP>
  )
}
export default TotalEntries
