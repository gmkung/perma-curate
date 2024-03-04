import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { responsiveSize } from 'styles/responsiveSize'
import { useNavigate } from 'react-router-dom'
import CurateLogo from 'tsx:svgs/header/curate-logo.svg'
import Registries from './Registries'

const Container = styled.div`
  display: flex;
  position: relative;
  width: 100%;
  height: 108px;
  flex-direction: column;
  background: #3d106c;
  align-items: center;
  justify-content: center;
  margin-bottom: ${responsiveSize(16, 24)};
  gap: 16px;

  ${landscapeStyle(
    () => css`
      height: 60px;
      flex-direction: row;
      justify-content: space-between;
    `
  )}
`

const StyledCurateLogo = styled(CurateLogo)`
  height: 44px;
  width: 44px;
`

const StyledText = styled.text`
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  font-family: 'Avenir', sans-serif;
`

const Title = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  ${landscapeStyle(
    () => css`
      padding-left: 64px;
    `
  )}
`

const StyledA = styled.a`
  display: none;
  font-family: 'Oxanium', sans-serif;

  ${landscapeStyle(
    () => css`
      display: flex;
      position: relative;
      padding-right: 64px;
      text-decoration: none;
      color: #fff;

      :hover {
        text-decoration: underline;
      }
    `
  )}
`

interface INavbar {}

const Navbar: React.FC<INavbar> = ({}) => {
  const navigate = useNavigate()

  const handlerClickTitle = () => {
    navigate('/')
  }

  return (
    <Container>
      <Title onClick={handlerClickTitle}>
        <StyledCurateLogo />
        <StyledText>Kleros Scout</StyledText>
      </Title>
      <Registries />
      <StyledA
        href="https://blog.kleros.io/renewal-and-amendments-in-curates-combined-incentive-program/"
        target="blank"
      >
        Earn Rewards by Submitting!
      </StyledA>
    </Container>
  )
}
export default Navbar
