import React, { Dispatch, SetStateAction } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import Entry from './Entry'

const EntriesContainer = styled.div`
  width: 80%;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 28px 54px;
  justify-content: center;

  ${landscapeStyle(
    () => css`
      grid-template-columns: repeat(4, 1fr);
    `
  )}
`

interface IEntriesList {
  displayedData: any
  activeList: any
  setDetailsData: Dispatch<SetStateAction<any>>
  setEntryStatus: Dispatch<SetStateAction<any>>
  setItemId: Dispatch<SetStateAction<any>>
  setEvidences: Dispatch<SetStateAction<any>>
  setIsDetailsModalOpen: Dispatch<SetStateAction<boolean>>
}

const EntriesList: React.FC<IEntriesList> = ({
  displayedData,
  activeList,
  setDetailsData,
  setEntryStatus,
  setItemId,
  setEvidences,
  setIsDetailsModalOpen,
}) => {
  return (
    <EntriesContainer>
      {displayedData.map((item, index) => (
        <Entry
          key={index}
          item={item}
          activeList={activeList}
          setDetailsData={setDetailsData}
          setEntryStatus={setEntryStatus}
          setItemId={setItemId}
          setEvidences={setEvidences}
          setIsDetailsModalOpen={setIsDetailsModalOpen}
        />
      ))}
    </EntriesContainer>
  )
}

export default EntriesList
