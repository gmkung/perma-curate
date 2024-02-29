import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { responsiveSize } from 'styles/responsiveSize'
import { useSearchParams } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 12px;
  background: #380c65;
  padding: 21px ${responsiveSize(16, 32)};
  justify-content: space-between;
  cursor: pointer;
  box-sizing: border-box;
  gap: 20px;

  ${landscapeStyle(
    () => css`
      width: 33%;
    `
  )}
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
`

const View = styled.a`
  font-size: 16px;
  font-weight: 700;
  font-family: 'Orbitron', sans-serif;
  color: #9c46ff;
  text-decoration: underline;
  margin-top: 4px;
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
