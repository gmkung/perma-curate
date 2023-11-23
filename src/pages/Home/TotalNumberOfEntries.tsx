import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'

const Paragraph = styled.p`
  text-align: center;
  font-size: 20px;
  margin-bottom: 24px;
`

const InfoText = styled.i`
  font-size: 16px;
  color: grey;
`

const Button = styled.button`
  background-color: #805ad5;
  padding: 8px 16px;
  border-radius: 12px;
  margin-left: 16px;
  &:hover {
    background-color: #6b46c1;
  }
`

interface ITotalNumberOfEntries {
  loading: boolean
  filteredData: any
  setIsModalOpen: Dispatch<SetStateAction<boolean>>
}

const TotalNumberOfEntries: React.FC<ITotalNumberOfEntries> = ({
  loading,
  filteredData,
  setIsModalOpen,
}) => {
  return (
    <Paragraph>
      Total entries:{' '}
      {loading ? (
        <InfoText>calculating...</InfoText>
      ) : (
        <> {filteredData.length} </>
      )}
      <Button onClick={() => setIsModalOpen(true)}>Add Entry</Button>
    </Paragraph>
  )
}

export default TotalNumberOfEntries
