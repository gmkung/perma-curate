import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { useQuery } from '@tanstack/react-query'
import RichAddressForm, { NetworkOption } from './RichAddressForm'
import getAddressValidationIssue from 'utils/validateAddress'
import ImageUpload from './ImageUpload'
import ipfsPublish from 'utils/ipfsPublish'
import { initiateTransactionToCurate } from 'utils/initiateTransactionToCurate'
import { fetchItemCounts } from 'utils/itemCounts'
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
    label: 'Contract address',
    description:
      'The address of the contract in question. Case-sensitive only if required by the blockchain that the address pertains to (e.g. Solana). ',
    type: 'rich address',
    isIdentifier: true,
  },
  {
    label: 'Domain name',
    description:
      'The specific (sub)domain name of the dApp where this contract is meant to be accessed from.  Wildcards (*) are acceptable as part of this field if proof can be shown that the contract is intended to be used across multiple domains.',
    type: 'text',
    isIdentifier: true,
  },
  {
    label: 'Visual proof',
    description:
      'If the domain is a specific root or subdomain, this must be a screenshot of the exact page and setup where this particular address can be interacted from.',
    type: 'image',
    isIdentifier: false,
  },
]

const AddCDN: React.FC = () => {
  const [network, setNetwork] = useState<NetworkOption>({
    value: 'eip155:1',
    label: 'Mainnet',
  })
  const [address, setAddress] = useState<string>('')
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

  const { isLoading: addressIssuesLoading, data: addressIssuesData } = useQuery(
    {
      queryKey: ['addressissues', network.value + ':' + address, 'CDN', '-'],
      queryFn: () =>
        getAddressValidationIssue(network.value, address, 'CDN'),
    }
  )

  const [domain, setDomain] = useState<string>('')

  const submitCDN = async () => {
    const values = {
      'Contract address': `${network.value}:${address}`,
      'Domain name': domain,
      'Visual proof': path,
    }
    const item = {
      columns,
      values,
    }
    const enc = new TextEncoder()
    const fileData = enc.encode(JSON.stringify(item))
    const ipfsURL = await ipfsPublish('item.json', fileData)
    await initiateTransactionToCurate(
      '0x957a53a994860be4750810131d9c876b2f52d6e1',
      countsData?.CDN.deposits as DepositParams,
      ipfsURL
    )
  }

  const submittingDisabled =
    !address ||
    !domain ||
    !!addressIssuesData ||
    !!addressIssuesLoading ||
    !path

  return (
    <div>
      <h2>Submit CDN</h2>
      <RichAddressForm
        networkOption={network}
        setNetwork={setNetwork}
        address={address}
        setAddress={setAddress}
        registry="Tags"
      />
      {addressIssuesLoading && 'Loading'}
      {addressIssuesData && addressIssuesData.message}
      domain
      <StyledTextInput
        placeholder="domain"
        value={domain}
        onChange={(e) => setDomain(e.target.value)}
      />
      <ImageUpload path={path} setPath={setPath} />
      <button disabled={submittingDisabled} onClick={submitCDN}>
        Submit -{' '}
        {countsData &&
          formatEther(
            countsData.CDN.deposits.arbitrationCost +
              countsData.CDN.deposits.submissionBaseDeposit
          )}{' '}
        xDAI
      </button>
    </div>
  )
}

export default AddCDN
