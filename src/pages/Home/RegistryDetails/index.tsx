import React from 'react'
import styled from 'styled-components'
import { useToggle } from 'react-use'
import TotalEntries from './TotalEntries'
import RightDirectionIcon from 'tsx:svgs/icons/right-direction.svg'
import DownDirectionIcon from 'tsx:svgs/icons/down-direction.svg'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin-bottom: 12px;
  border-radius: 12px;
  background: #380c65;
  padding: 20px 32px;
  cursor: pointer;
  box-sizing: border-box;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TextContainer = styled.div`
  display: flex;
  font-size: 22px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: white;
  gap: 12px;
`

const Expanded = styled.div<{ isExpanded: boolean }>`
  display: ${({ isExpanded }) => (isExpanded ? 'flex' : 'none')};
  gap: 0 160px;
  border-radius: 0 0 12px 12px;
  flex-wrap: wrap;
`

const StyledP = styled.p`
  font-size: 20px;
  color: #d6d6d6;
  margin: 0;
  margin-top: 16px;
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
    <Container onClick={toggleExpand}>
      <Header>
        <TextContainer>
          <span>Registry Details </span>
          <div>
            {isExpanded ? <DownDirectionIcon /> : <RightDirectionIcon />}
          </div>
        </TextContainer>
        {!isExpanded ? (
          <TotalEntries
            isExpanded={false}
            loading={loading}
            filteredData={filteredData}
          />
        ) : null}
      </Header>
      <Expanded isExpanded={isExpanded}>
        <StyledP>Title: Address Tags</StyledP>
        <StyledP>Primary Document: Link</StyledP>
        <TotalEntries
          isExpanded={true}
          loading={loading}
          filteredData={filteredData}
        />
        <StyledP>
          Description: A list of public name tags, associated with contract
          addresses on various blockchains.
        </StyledP>
      </Expanded>
    </Container>
  )
}

export default RegistryDetails
