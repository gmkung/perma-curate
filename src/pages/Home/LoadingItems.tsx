import React from 'react'

interface ILoadingItems {}

const LoadingItems: React.FC<ILoadingItems> = ({}) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '2rem',
      }}
    >
      <img
        src="https://assets.materialup.com/uploads/92425af1-601b-486e-ad06-1de737628ca0/preview.gif"
        alt="Loading..."
        style={{ height: '8rem' }}
      />
    </div>
  )
}
export default LoadingItems
