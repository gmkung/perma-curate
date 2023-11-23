import React, { Dispatch, SetStateAction } from 'react'

interface ISearch {
  searchTerm: string
  setSearchTerm: Dispatch<SetStateAction<string>>
}

const Search: React.FC<ISearch> = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-4/5 mx-auto flex items-center pb-2">
      <label className="bg-purple-600 p-2 rounded-l-lg text-white">
        Search
      </label>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Enter keywords, Ethereum addresses..."
        className="flex-grow p-2 focus:outline-none border-purple-500 border-l-0 text-gray-800 rounded-r-lg"
      />
    </div>
  )
}
export default Search
