import React, { SetStateAction, Dispatch } from 'react'
import Select from 'react-select'
import styled, { css } from 'styled-components'
import { StyledWholeField } from './AddTag'
import { landscapeStyle } from '~src/styles/landscapeStyle'
import { relevantNetworks } from 'utils/fetchItems'

const StyledAddressDiv = styled.div`
  display: flex;
  flex-direction: row;
`

const StyledNetworkSelect = styled(Select)`
  font-weight: bold;
  color: black;
  width: 30%;
`

const StyledAddressInput = styled.input`
  display: flex;
  padding: 12px;
  outline: none;
  border: 2px solid #805ad5;
  border-left: 0;
  color: #2d3748;
  border-radius: 12px;
  border-radius: 0 12px 12px 12px;
  font-family: 'Oxanium', sans-serif;
  font-size: 16px;
  font-weight: 700;
  ::placeholder {
    font-family: 'Oxanium', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #c7c7c7;
  }

  ${landscapeStyle(
    () => css`
      width: 100%;
      padding-left: 24px;
      border-radius: 0 12px 12px 0;
    `
  )}
`

const networkOptions = relevantNetworks.map((n) => ({
  value: 'eip155:' + n.chainId,
  label: n.name,
}))

export interface NetworkOption {
  value: string
  label: string
}

const RichAddressForm: React.FC<{
  networkOption: NetworkOption // entire chain! ; namespace:reference , e.g. eip155:1
  setNetwork: Dispatch<SetStateAction<NetworkOption>>
  address: string
  setAddress: Dispatch<SetStateAction<string>>
  registry: string
  domain?: string // checks for dupe richAddress - domain pairs, in domains.
}> = (p) => {
  return (
    <StyledWholeField>
      Address
      <StyledAddressDiv>
        <StyledNetworkSelect
          onChange={p.setNetwork}
          value={p.networkOption}
          options={networkOptions}
        />
        <StyledAddressInput
          onChange={(e) => p.setAddress(e.target.value)}
          value={p.address}
          placeholder="0x93ed3fbe21207ec2e8f2d3c3de6e058cb73bc04d"
        />
      </StyledAddressDiv>
    </StyledWholeField>
  )
}

export default RichAddressForm
