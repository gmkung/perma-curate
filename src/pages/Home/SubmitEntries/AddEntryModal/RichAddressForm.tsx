import React, { SetStateAction, Dispatch } from 'react'
import Select from 'react-select'
import styled, { css } from 'styled-components'
import { StyledWholeField } from '.'
import { landscapeStyle } from '~src/styles/landscapeStyle'
import { relevantNetworks } from 'utils/fetchItems'

const StyledAddressDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 8px;
`

const StyledNetworkSelect = styled(Select)`
  font-weight: bold;
  color: #cd9dff;
  width: 200px;

  > div {
    background-color: #855caf;
    border: none;
    border-radius: 12px 12px 0 0;

    > input {
      color: #fff;
      padding: 12px;
      background-color: #855caf;
      border-radius: 12px;

      :hover {
        background-color: #855caf;
      }
    }
  }
  * div {
    color: #fff;
    padding: 5px 11px;
  }
`

export const StyledAddressInput = styled.input`
  display: flex;
  width: 100%;
  background: #855caf;
  padding: 8px 12px;
  outline: none;
  border: none;
  color: #fff;
  border-radius: 0 12px 12px 12px;
  font-size: 18px;
  font-weight: 700;
  ::placeholder {
    font-size: 18px;
    font-weight: 700;
    color: #cd9dff;
  }

  ${landscapeStyle(
    () => css`
      width: 95%;
      padding-left: 24px;
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
