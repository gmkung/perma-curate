import React from 'react'
import styled from 'styled-components'
import { useSearchParams } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 12px;
  background: #380c65;
  padding: 21px 10px;
  cursor: pointer;
  box-sizing: border-box;
  width: 40%;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
`

const TextContainer = styled.div`
  display: flex;
  font-size: 22px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: white;
  gap: 12px;
  padding-left: 20px;
`

const View = styled.a`
  font-size: 16px;
  font-family: 'Orbitron', sans-serif;
  color: #9c46ff;
  text-decoration: underline;
  margin-top: 4px;
  padding-left: 20px;
  padding-right: 10px;
`

const RegistryDetails: React.FC = () => {
  const [, setSearchParams] = useSearchParams()
  const openModal = () => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.append('registrydetails', 'true')
      return newParams
    })
  }

  return (
    <Container onClick={openModal}>
      <Header>
        <TextContainer>
          <span>Registry Details </span>
        </TextContainer>
      </Header>
      <View>View</View>
    </Container>
  )
}

export default RegistryDetails
