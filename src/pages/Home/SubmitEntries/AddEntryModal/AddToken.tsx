import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { useQuery } from '@tanstack/react-query'
import RichAddressForm, { NetworkOption } from './RichAddressForm'
import getAddressValidationIssue from 'utils/validateAddress'
import ImageUpload from './ImageUpload'
import ipfsPublish from 'utils/ipfsPublish'
import { fetchItemCounts } from 'utils/itemCounts'
import { initiateTransactionToCurate } from 'utils/initiateTransactionToCurate'
import { DepositParams } from 'utils/fetchRegistryDeposits'
import { formatEther } from 'ethers'

export const StyledWholeField = styled.div`
  display: flex;
  flex-direction: column;
`

const StyledTextInput = styled.input`
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

const columns = [
  {
    label: 'Address',
    description:
      'The address of the smart contract being tagged. Will be store in CAIP-10 format if the chain is properly selected in the UI.',
    type: 'rich address',
    isIdentifier: true,
  },
  {
    label: 'Name',
    description: 'The name of the token',
    type: 'text',
    isIdentifier: true,
  },
  {
    label: 'Symbol',
    description: 'The symbol/ticker of the token',
    type: 'text',
    isIdentifier: true,
  },
  {
    label: 'Decimals',
    description: 'The number of decimals applicable for this token',
    type: 'number',
  },
  {
    label: 'Logo',
    description: 'The PNG logo of the token (at least 128px X 128px in size',
    type: 'image',
    isIdentifier: false,
  },
]

const AddToken: React.FC = () => {
  const [network, setNetwork] = useState<NetworkOption>({
    value: 'eip155:1',
    label: 'Mainnet',
  })
  const [address, setAddress] = useState<string>('')

  const { isLoading: addressIssuesLoading, data: addressIssuesData } = useQuery(
    {
      queryKey: ['addressissues', network.value + ':' + address, 'Tokens', '-'],
      queryFn: () =>
        getAddressValidationIssue(network.value, address, 'Tokens'),
    }
  )

  const [decimals, setDecimals] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [symbol, setSymbol] = useState<string>('')
  const [path, setPath] = useState<string>('')

  const {
    isLoading: countsLoading,
    error: countsError,
    data: countsData,
  } = useQuery({
    queryKey: ['counts'],
    queryFn: () => fetchItemCounts(),
    staleTime: Infinity,
  })

  const submitToken = async () => {
    const values = {
      Address: `${network.value}:${address}`,
      Name: name,
      Symbol: symbol,
      Decimals: Number(decimals),
      Logo: path,
    }
    const item = {
      columns,
      values,
    }
    const enc = new TextEncoder()
    const fileData = enc.encode(JSON.stringify(item))
    const ipfsURL = await ipfsPublish('item.json', fileData)
    await initiateTransactionToCurate(
      '0xee1502e29795ef6c2d60f8d7120596abe3bad990',
      countsData?.Tokens.deposits as DepositParams,
      ipfsURL
    )
  }

  const submittingDisabled =
    !address ||
    !decimals ||
    !name ||
    !symbol ||
    !!addressIssuesData ||
    !!addressIssuesLoading ||
    !path

  return (
    <div>
      <h2>Submit Token</h2>
      <RichAddressForm
        networkOption={network}
        setNetwork={setNetwork}
        address={address}
        setAddress={setAddress}
        registry="Tags"
      />
      {addressIssuesLoading && 'Loading'}
      {addressIssuesData && addressIssuesData.message}
      decimals
      <StyledTextInput
        placeholder="decimals"
        value={decimals}
        onChange={(e) => setDecimals(e.target.value)}
      />
      name
      <StyledTextInput
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      symbol
      <StyledTextInput
        placeholder="symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <ImageUpload path={path} setPath={setPath} />
      <button disabled={submittingDisabled} onClick={submitToken}>
        Submit -{' '}
        {countsData &&
          formatEther(
            countsData.Tokens.deposits.arbitrationCost +
              countsData.Tokens.deposits.submissionBaseDeposit
          )}{' '}
        xDAI
      </button>
    </div>
  )
}

export default AddToken
