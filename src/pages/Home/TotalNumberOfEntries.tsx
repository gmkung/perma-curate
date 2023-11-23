import React, { Dispatch, SetStateAction } from 'react'

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
    <p className="text-center text-xl mb-6">
      Total entries:{' '}
      {loading ? (
        <i style={{ fontSize: '0.8em', color: 'grey' }}>calculating...</i>
      ) : (
        <> {filteredData.length} </>
      )}
      <button
        onClick={() => setIsModalOpen(true)}
        className="ml-4 bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500"
      >
        Add Entry
      </button>
    </p>
  )
}
export default TotalNumberOfEntries
