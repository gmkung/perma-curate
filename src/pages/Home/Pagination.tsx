import React, { Dispatch, SetStateAction, useState } from 'react'

interface IPagination {
  totalPages: number
  setCurrentPage: Dispatch<SetStateAction<number>>
}

const Pagination: React.FC<IPagination> = ({ totalPages, setCurrentPage }) => {
  const [pageInput, setPageInput] = useState<number>(1)

  return (
    <div className="w-4/5 mx-auto mt-12 flex justify-between">
      <button
        className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500"
        onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
      >
        Previous
      </button>
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={pageInput}
          onChange={(e) =>
            setPageInput(
              Math.min(Math.max(1, parseInt(e.target.value)), totalPages)
            )
          } // ensure input stays between 1 and totalPages
          className="w-16 p-2 rounded-l-lg focus:outline-none border-purple-500 text-gray-800"
        />
        <span className="text-white-600">of {totalPages}</span>
        <button
          className="bg-purple-600 p-2 rounded-r-lg hover:bg-purple-500"
          onClick={() => setCurrentPage(pageInput)}
        >
          Go
        </button>
      </div>
      <button
        className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500"
        onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
      >
        Next
      </button>
    </div>
  )
}
export default Pagination
