// this file will likely be deleted

import tagsItemTemplate from 'assets/tags-item-template.json'
import CDNItemTemplate from 'assets/cdn-item-template.json'
import tokensItemTemplate from 'assets/tokens-item-template.json'
import ipfsPublish from './ipfsPublish'
import { initiateTransactionToCurate } from './initiateTransactionToCurate'

export const handleFormSubmit = async (
  event: any,
  depositParams,
  toggleAddEntryModal,
  activeList,
  curateContractAddress
) => {
  event.preventDefault()
  // Check if depositParams is null and throw an error if it is

  if (!depositParams) {
    throw new Error('depositParams is null')
  }

  const formData = new FormData(event.target)
  let dataObject = {}

  switch (activeList) {
    case 'Tags':
      dataObject = {
        'Contract Address': formData.get('contractAddress'),
        'Public Name Tag': formData.get('publicNameTag'),
        'Project Name': formData.get('projectName'),
        'UI/Website Link': formData.get('uiLink'),
        'Public Note': formData.get('publicNote'),
      }
      break
    case 'CDN':
      dataObject = {
        'Contract Address': formData.get('contractAddress'),
        'Domain name': formData.get('domainName'),
        'Visual proof': document
          .getElementById('visualProof')
          ?.getAttribute('data-uri'),
      }
      break
    case 'Tokens':
      dataObject = {
        Address: formData.get('contractAddress'),
        Name: formData.get('name'),
        Symbol: formData.get('symbol'),
        Decimals: formData.get('decimals'),
        Logo: document.getElementById('logoImage')?.getAttribute('data-uri'),
      }
      break

    default:
      console.error('Invalid active list type:', activeList)
  }

  const formattedData = {
    ...(activeList === 'Tags'
      ? tagsItemTemplate
      : activeList === 'CDN'
      ? CDNItemTemplate
      : activeList === 'Tokens'
      ? tokensItemTemplate
      : {}),
    values: dataObject,
  }
  console.log(formattedData)

  // Step 3: Store the JSON object in IPFS using Kleros's node
  const ipfsPath = await postJsonToKlerosIpfs(formattedData)
  console.log(ipfsPath)

  // Step 4: Initiate a transaction to Curate's contract (Placeholder)
  // You will need a function that interacts with the Ethereum blockchain to submit the data to Curate's contract.
  const transactionSuccess = await initiateTransactionToCurate(
    curateContractAddress,
    depositParams,
    ipfsPath
  )

  // Step 5: Close the pop-up
  if (transactionSuccess) {
    // Only close the modal if the transaction was successful
    toggleAddEntryModal()
  } else {
    // Optionally, show an error message to the user here
    console.error('Transaction failed.')
  }
}
