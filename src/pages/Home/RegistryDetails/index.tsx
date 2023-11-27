import React from 'react'
import styled from 'styled-components'
import { useToggle } from 'react-use'
import TotalEntries from './TotalEntries'

const Container = styled.div`
  display: flex;
  width: 80%;
  margin: 0 auto;
  margin-bottom: 12px;
  align-items: center;
  border-radius: 12px;
  background: #380c65;
  padding: 20px 32px 20px 20px;
  justify-content: space-between;
`

const StyledText = styled.text`
  font-size: 22px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
`

interface IRegistryDetails {
  loading: boolean
  filteredData: any
}

const RegistryDetails: React.FC<IRegistryDetails> = ({
  loading,
  filteredData,
}) => {
  const [isExpanded, toggleExpand] = useToggle(false)

  return (
    <>
      <Container>
        <StyledText>Registry Details {'>'}</StyledText>
        <TotalEntries loading={loading} filteredData={filteredData} />
      </Container>
    </>
  )
}
export default RegistryDetails
