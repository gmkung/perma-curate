import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { landscapeStyle } from 'styles/landscapeStyle'
import { useQuery } from '@tanstack/react-query'
import RichAddressForm, { NetworkOption } from './RichAddressForm'
import getAddressValidationIssue from 'utils/validateAddress'
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
    label: 'Contract Address',
    description:
      'The address of the smart contract being tagged. Will be store in CAIP-10 format if the chain is properly selected in the UI.',
    type: 'rich address',
    isIdentifier: true,
  },
  {
    label: 'Public Name Tag',
    description:
      'The Public Name tag of a contract address indicates a commonly-used name of the smart contract and clearly identifies it to avoid potential confusion. (e.g. Eth2 Deposit Contract).',
    type: 'text',
    isIdentifier: true,
  },
  {
    label: 'Project Name',
    description:
      'The name of the project that the contract belongs to. Can be omitted only for contracts which do not belong to a project',
    type: 'text',
    isIdentifier: true,
  },
  {
    label: 'UI/Website Link',
    description:
      'The URL of the most popular user interface used to interact with the contract tagged or the URL of the official website of the contract deployer (e.g. https://launchpad.ethereum.org/en/).',
    type: 'link',
    isIdentifier: true,
  },
  {
    label: 'Public Note',
    description:
      'The Public Note is a short, mandatory comment field used to add a comment/information about the contract that could not fit in the public name tag (e.g. Official Ethereum 2.0 Beacon Chain deposit contact address).',
    type: 'text',
  },
]

const AddAddressTag: React.FC = () => {
  const [network, setNetwork] = useState<NetworkOption>({
    value: 'eip155:1',
    label: 'Mainnet',
  })
  const [address, setAddress] = useState<string>('')

  const { isLoading: addressIssuesLoading, data: addressIssuesData } = useQuery(
    {
      queryKey: ['addressissues', network.value + ':' + address, 'Tags', '-'],
      queryFn: () => getAddressValidationIssue(network.value, address, 'Tags'),
    }
  )

  const [projectName, setProjectName] = useState<string>('')
  const [contractName, setContractName] = useState<string>('')
  const [publicNote, setPublicNote] = useState<string>('')
  const [website, setWebsite] = useState<string>('')

  const {
    isLoading: countsLoading,
    error: countsError,
    data: countsData,
  } = useQuery({
    queryKey: ['counts'],
    queryFn: () => fetchItemCounts(),
    staleTime: Infinity,
  })

  const submitAddressTag = async () => {
    const values = {
      'Contract Address': `${network.value}:${address}`,
      'Public Name Tag': contractName,
      'Project Name': projectName,
      'UI/Website Link': website,
      'Public Note': publicNote,
    }
    const item = {
      columns,
      values,
    }
    const enc = new TextEncoder()
    const fileData = enc.encode(JSON.stringify(item))
    const ipfsURL = await ipfsPublish('item.json', fileData)
    await initiateTransactionToCurate(
      '0x66260c69d03837016d88c9877e61e08ef74c59f2',
      countsData?.Tags.deposits as DepositParams,
      ipfsURL
    )
  }

  const submittingDisabled =
    !address ||
    !projectName ||
    !contractName ||
    !publicNote ||
    !website ||
    !!addressIssuesData ||
    !!addressIssuesLoading

  return (
    <div>
      <h2>Submit Address Tag</h2>
      <RichAddressForm
        networkOption={network}
        setNetwork={setNetwork}
        address={address}
        setAddress={setAddress}
        registry="Tags"
      />
      {addressIssuesLoading && 'Loading'}
      {addressIssuesData && addressIssuesData.message}
      project name
      <StyledTextInput
        placeholder="project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      contract name
      <StyledTextInput
        placeholder="contract name"
        value={contractName}
        onChange={(e) => setContractName(e.target.value)}
      />
      public note
      <StyledTextInput
        placeholder="public note"
        value={publicNote}
        onChange={(e) => setPublicNote(e.target.value)}
      />
      ui/website link
      <StyledTextInput
        placeholder="ui/website link"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <button disabled={submittingDisabled} onClick={submitAddressTag}>
        Submit -{' '}
        {countsData &&
          formatEther(
            countsData.Tags.deposits.arbitrationCost +
              countsData.Tags.deposits.submissionBaseDeposit
          )}{' '}
        xDAI
      </button>
    </div>
  )
}

export default AddAddressTag
