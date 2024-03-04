import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import RichAddressForm, { NetworkOption } from './RichAddressForm'
import getAddressValidationIssue from 'utils/validateAddress'
import ipfsPublish from 'utils/ipfsPublish'
import { initiateTransactionToCurate } from 'utils/initiateTransactionToCurate'
import { fetchItemCounts } from 'utils/itemCounts'
import { DepositParams } from 'utils/fetchRegistryDeposits'
import { formatEther } from 'ethers'
import {
  AddContainer,
  AddHeader,
  AddSubtitle,
  AddTitle,
  Buttons,
  ErrorMessage,
  ReturnButton,
  StyledGoogleFormAnchor,
  StyledTextInput,
  SubmitButton,
} from '.'

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
    <AddContainer>
      <AddHeader>
        <AddTitle>Submit Address Tag</AddTitle>
        <AddSubtitle>
          Want to suggest an entry without any deposit?{' '}
          <StyledGoogleFormAnchor
            target="_blank"
            href="https://docs.google.com/forms/d/e/1FAIpQLSdTwlrcbbPOkSCMKuUj42d_koSAEkWjMLz5hhTc5lB6aGCO9w/viewform"
          >
            Click here
          </StyledGoogleFormAnchor>
        </AddSubtitle>
      </AddHeader>
      <RichAddressForm
        networkOption={network}
        setNetwork={setNetwork}
        address={address}
        setAddress={setAddress}
        registry="Tags"
      />
      {addressIssuesLoading && 'Loading'}
      {addressIssuesData && (
        <ErrorMessage>{addressIssuesData.message}</ErrorMessage>
      )}
      Project name
      <StyledTextInput
        placeholder="project name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      Contract name
      <StyledTextInput
        placeholder="contract name"
        value={contractName}
        onChange={(e) => setContractName(e.target.value)}
      />
      Public note
      <StyledTextInput
        placeholder="public note"
        value={publicNote}
        onChange={(e) => setPublicNote(e.target.value)}
      />
      UI/Website link
      <StyledTextInput
        placeholder="ui/website link"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
      />
      <Buttons>
        <ReturnButton />
        <SubmitButton disabled={submittingDisabled} onClick={submitAddressTag}>
          Submit -{' '}
          {countsData &&
            formatEther(
              countsData.Tags.deposits.arbitrationCost +
                countsData.Tags.deposits.submissionBaseDeposit
            )}{' '}
          xDAI
        </SubmitButton>
      </Buttons>
    </AddContainer>
  )
}

export default AddAddressTag
