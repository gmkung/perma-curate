import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import RichAddressForm, { NetworkOption } from './RichAddressForm'
import getAddressValidationIssue from 'utils/validateAddress'
import ImageUpload from './ImageUpload'
import ipfsPublish from 'utils/ipfsPublish'
import { fetchItemCounts } from 'utils/itemCounts'
import { initiateTransactionToCurate } from 'utils/initiateTransactionToCurate'
import { DepositParams } from 'utils/fetchRegistryDeposits'
import { formatEther } from 'ethers'
import {
  AddContainer,
  AddHeader,
  AddSubtitle,
  AddTitle,
  CloseButton,
  ErrorMessage,
  StyledGoogleFormAnchor,
  StyledTextInput,
  SubmitButton,
} from '.'
import { ClosedButtonContainer } from '../..'

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
    <AddContainer>
      <AddHeader>
        <div>
          <AddTitle>Submit Token</AddTitle>
          <AddSubtitle>
            Want to suggest an entry without any deposit?{' '}
            <StyledGoogleFormAnchor
              target="_blank"
              href="https://docs.google.com/forms/d/e/1FAIpQLSchZ5RBd1Y8RNpGCUGY9tZyQZSBgnN_4B9oLfKeKuer9oxGnA/viewform"
            >
              Click here
            </StyledGoogleFormAnchor>
          </AddSubtitle>
        </div>
        <ClosedButtonContainer>
          <CloseButton />
        </ClosedButtonContainer>
      </AddHeader>
      <RichAddressForm
        networkOption={network}
        setNetwork={setNetwork}
        address={address}
        setAddress={setAddress}
        registry="Tags"
      />
      {addressIssuesLoading && 'Loading...'}
      {addressIssuesData && (
        <ErrorMessage>{addressIssuesData.message}</ErrorMessage>
      )}
      Decimals
      <StyledTextInput
        placeholder="decimals"
        value={decimals}
        onChange={(e) => setDecimals(e.target.value)}
      />
      Name
      <StyledTextInput
        placeholder="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      Symbol
      <StyledTextInput
        placeholder="symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
      />
      <ImageUpload path={path} setPath={setPath} />
      <SubmitButton disabled={submittingDisabled} onClick={submitToken}>
        Submit -{' '}
        {countsData &&
          formatEther(
            countsData.Tokens.deposits.arbitrationCost +
              countsData.Tokens.deposits.submissionBaseDeposit
          )}{' '}
        xDAI
      </SubmitButton>
    </AddContainer>
  )
}

export default AddToken
