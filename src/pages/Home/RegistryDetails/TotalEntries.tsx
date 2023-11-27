import React from 'react'
import styled from 'styled-components'

const StyledText = styled.text`
  font-size: 20px;
  color: #d6d6d6;
`

interface ITotalEntries {
  loading: boolean
  filteredData: any
}

const TotalEntries: React.FC<ITotalEntries> = ({ loading, filteredData }) => {
  return (
    <StyledText>
      Total entries: {loading ? <i>calculating...</i> : filteredData.length}
    </StyledText>
  )
}
export default TotalEntries
