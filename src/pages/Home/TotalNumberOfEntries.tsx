import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import Button from '~src/components/Button'

const Paragraph = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 24px;
  gap: 24px;
`

const InfoText = styled.i`
  font-size: 16px;
  color: white;
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
      <span>Total entries: {' '}
        {loading ? (
          <InfoText>calculating...</InfoText>
        ) : (
          filteredData.length
        )}
      </span>
      <Button onClick={() => setIsModalOpen(true)}>Add Entry</Button>
    </Paragraph>
  )
}

export default TotalNumberOfEntries
