import React from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import AddressDisplay from 'components/AddressDisplay'
import { GraphItem, Prop, registryMap } from '~src/utils/fetchItems'
import { useSearchParams } from 'react-router-dom'
import { formatEther } from 'ethers'

const Container = styled.div`
  display: flex;
  width: 84vw;
  flex-direction: column;
  box-sizing: border-box;
  gap: 8px;
  justify-content: center;
  align-items: center;
  background-color: #380c65;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #3c1b5c;
  word-break: break-word;
  transition: transform 150ms ease-in-out, box-shadow 150ms ease-in-out;
  &:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.2);
  }
  &:active {
    transform: scale(0.95);
  }

  ${landscapeStyle(
    () => css`
      width: auto;
    `
  )}
`

const StatusSpan = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 8px;
  color: white;
  border-radius: 4px;
  margin-top: 8px;
`

const Image = styled.img<{ isFullWidth: boolean }>`
  width: 100px;
  height: 100px;
  ${({ isFullWidth }) => isFullWidth && 'width: 100%; height: 100%;'}
`

interface IEntry {
  item: GraphItem
}

const Status: React.FC<{
  status:
    | 'Registered'
    | 'Absent'
    | 'RegistrationRequested'
    | 'ClearingRequested'
  disputed: boolean
  bounty: string
}> = ({ status, disputed, bounty }) => {
  const readableStatusMap = {
    Registered: 'Registered',
    Absent: 'Removed',
    RegistrationRequested: 'Submitted',
    ClearingRequested: 'Removing',
  }
  const challengedStatusMap = {
    RegistrationRequested: 'Challenged Submission',
    ClearingRequested: 'Challenged Removal',
  }
  const label = disputed
    ? challengedStatusMap[status]
    : readableStatusMap[status]

  const readableBounty =
    (status === 'ClearingRequested' || status === 'RegistrationRequested') &&
    !disputed
      ? Number(formatEther(bounty))
      : null

  return (
    <StatusSpan status={label}>
      {label}
      {readableBounty ? ' — ' + readableBounty + ' xDAI' : ''}
    </StatusSpan>
  )
}

const Entry: React.FC<IEntry> = ({ item }) => {
  const [, setSearchParams] = useSearchParams()

  const handleEntryClick = () => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      newParams.append('itemdetails', item.id)
      return newParams
    })
  }
  return (
    <Container
      onClick={() => {
        handleEntryClick()
      }}
    >
      <Status
        status={item.status}
        disputed={item.disputed}
        bounty={item.requests[0].deposit}
      />

      <strong>
        <AddressDisplay address={item.key0} />
      </strong>

      {item.registryAddress === registryMap['Tags'] && (
        <div>
          <div>{item.key2}</div>
          <div>{item.key1}</div>
          <div>{item.key3}</div>
        </div>
      )}
      {item.registryAddress === registryMap['Tokens'] && (
        <div>
          {item.props && item.props.find((prop) => prop.label === 'Logo') && (
            <div>
              <Image
                src={`https://ipfs.kleros.io/${
                  (item.props.find((prop) => prop.label === 'Logo') as Prop)
                    .value
                }`}
                alt="Logo"
                isFullWidth={false}
              />
            </div>
          )}
          <div>{item.key2}</div>
          <div>{item.key1}</div>
        </div>
      )}
      {item.registryAddress === registryMap['CDN'] && (
        <div>
          <div>{item.key1}</div>
        </div>
      )}
    </Container>
  )
}

export default Entry
