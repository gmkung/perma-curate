import React from 'react'
import { useSearchParams } from 'react-router-dom'
import styled, { css } from 'styled-components'
import Button from '~src/components/Button'
import { landscapeStyle } from '~src/styles/landscapeStyle'
import { calcMinMax } from '~src/utils/calcMinMax'

const LabelsContainer = styled.div`
  display: flex;
  width: 84vw;
  margin-bottom: ${calcMinMax(16, 24)};
  flex-direction: column;

  ${landscapeStyle(
    () => css`
      width: 80%;
      flex-direction: row;
    `
  )}
`

const enabledStyle = {
  background: 'purple',
  borderRadius: '10px',
  opacity: '100%',
}
const disabledStyle = {
  borderRadius: '10px',
  opacity: '70%',
}

const Statuses: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const statuses = searchParams.getAll('status')

  const toggleStatus = (status: string) => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      const statuses = newParams.getAll('status')
      if (statuses.includes(status)) {
        // remove
        newParams.delete('status', status)
      } else {
        // add
        newParams.append('status', status)
      }
      // bounce to page 1
      newParams.delete('page')
      newParams.append('page', '1')
      return newParams
    })
  }

  return (
    <LabelsContainer>
      <Button
        style={statuses.includes('Registered') ? enabledStyle : disabledStyle}
        onClick={() => toggleStatus('Registered')}
      >
        Registered
      </Button>
      <Button
        style={
          statuses.includes('RegistrationRequested')
            ? enabledStyle
            : disabledStyle
        }
        onClick={() => toggleStatus('RegistrationRequested')}
      >
        Submitted
      </Button>
      <Button
        style={
          statuses.includes('ClearingRequested') ? enabledStyle : disabledStyle
        }
        onClick={() => toggleStatus('ClearingRequested')}
      >
        Removing
      </Button>
      <Button
        style={statuses.includes('Absent') ? enabledStyle : disabledStyle}
        onClick={() => toggleStatus('Absent')}
      >
        Removed
      </Button>
    </LabelsContainer>
  )
}

const Challenged: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const disputeds = searchParams.getAll('disputed')

  const toggleDisputed = (boolString: string) => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      const statuses = newParams.getAll('disputed')
      if (statuses.includes(boolString)) {
        // remove all
        newParams.delete('disputed')
        // append the opposite
        newParams.append('disputed', boolString === 'true' ? 'false' : 'true')
      } else {
        // add
        newParams.append('disputed', boolString)
      }
      // bounce to page 1
      newParams.delete('page')
      newParams.append('page', '1')
      return newParams
    })
  }

  return (
    <LabelsContainer>
      <Button
        style={disputeds.includes('false') ? enabledStyle : disabledStyle}
        onClick={() => toggleDisputed('false')}
      >
        Unchallenged
      </Button>
      <Button
        style={disputeds.includes('true') ? enabledStyle : disabledStyle}
        onClick={() => toggleDisputed('true')}
      >
        Challenged
      </Button>
    </LabelsContainer>
  )
}

const Networks: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const networks = searchParams.getAll('network')

  const toggleNetwork = (network: string) => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      const networks = newParams.getAll('network')
      if (networks.includes(network)) {
        // remove
        newParams.delete('network', network)
      } else {
        // add
        newParams.append('network', network)
      }
      // bounce to page 1
      newParams.delete('page')
      newParams.append('page', '1')
      return newParams
    })
  }

  return (
    <LabelsContainer>
      <Button
        style={networks.includes('1') ? enabledStyle : disabledStyle}
        onClick={() => toggleNetwork('1')}
      >
        Mainnet
      </Button>
      <Button
        style={networks.includes('100') ? enabledStyle : disabledStyle}
        onClick={() => toggleNetwork('100')}
      >
        Gnosis
      </Button>
      <Button
        style={networks.includes('137') ? enabledStyle : disabledStyle}
        onClick={() => toggleNetwork('137')}
      >
        Polygon
      </Button>
      <Button
        style={networks.includes('56') ? enabledStyle : disabledStyle}
        onClick={() => toggleNetwork('56')}
      >
        BSC
      </Button>
    </LabelsContainer>
  )
}

const Ordering: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const direction = searchParams.get('orderDirection')

  const toggleDirection = () => {
    setSearchParams((prev) => {
      const prevParams = prev.toString()
      const newParams = new URLSearchParams(prevParams)
      const direction = newParams.get('orderDirection')
      newParams.delete('orderDirection')
      if (direction === 'desc') {
        newParams.append('orderDirection', 'asc')
      } else {
        newParams.append('orderDirection', 'desc')
      }
      // bounce to page 1
      newParams.delete('page')
      newParams.append('page', '1')
      return newParams
    })
  }

  return (
    <LabelsContainer>
      <Button style={enabledStyle} onClick={() => toggleDirection()}>
        {direction === 'desc' ? 'Newest' : 'Oldest'}
      </Button>
    </LabelsContainer>
  )
}

const Container = styled.div`
  display: flex;
  width: 84vw;
  margin-bottom: ${calcMinMax(16, 24)};
  flex-direction: column;

  ${landscapeStyle(
    () => css`
      width: 80%;
      flex-direction: row;
    `
  )}
`

const Filters: React.FC = () => {
  return (
    <Container>
      <Statuses />
      <Challenged />
      <Networks />
      <Ordering />
    </Container>
  )
}

export default Filters
