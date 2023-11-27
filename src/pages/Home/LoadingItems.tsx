import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  height: 32px;
`

const LoadingImage = styled.img`
  height: 128px;
`

const LoadingItems: React.FC = () => {
  return (
    <Container>
      <LoadingImage
        src="https://assets.materialup.com/uploads/92425af1-601b-486e-ad06-1de737628ca0/preview.gif"
        alt="Loading..."
      />
    </Container>
  )
}

export default LoadingItems
