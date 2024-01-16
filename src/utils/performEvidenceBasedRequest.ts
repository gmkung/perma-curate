import ipfsPublish from './ipfsPublish'
import { Contract, ethers } from 'ethers'
import klerosCurateABI from './abi/kleros-curate-abi.json'
import { GraphItemDetails } from './itemDetails'
import { DepositParams } from './fetchRegistryDeposits'

export async function performEvidenceBasedRequest(
  itemDetails: GraphItemDetails,
  depositParams: DepositParams,
  arbitrationCost: bigint,
  evidenceTitle: string,
  evidenceText: string,
  requestType: string
): Promise<boolean> {
  try {
    if (!depositParams) {
      throw new Error('depositParams is null')
    }
    // Construct the JSON object with title and description
    const evidenceObject = {
      title: evidenceTitle,
      description: evidenceText,
    }
    const enc = new TextEncoder()
    const fileData = enc.encode(JSON.stringify(evidenceObject))

    const ipfsURL = await ipfsPublish('evidence.json', fileData)

    // Ensure MetaMask or an equivalent provider is available
    if (!window.ethereum) {
      throw new Error('Ethereum provider not found!')
    }

    // Initialize the provider from MetaMask or any injected Ethereum provider
    const provider = new ethers.BrowserProvider(window.ethereum)

    const signer = await provider.getSigner()
    // Prompt the user to connect their wallet
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    // Change to gnosis chain, or prompt user again
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [
        {
          chainId: '0x64',
        },
      ],
    })

    // Create an instance of the contract
    const contract = new Contract(
      itemDetails.registryAddress,
      klerosCurateABI,
      signer
    )

    let transactionResponse: any

    switch (requestType) {
      case 'Evidence':
        transactionResponse = await contract.submitEvidence(
          itemDetails.itemID,
          ipfsURL
        )
        break
      case 'RegistrationRequested':
        transactionResponse = await contract.challengeRequest(
          itemDetails.itemID,
          ipfsURL,
          {
            value:
              arbitrationCost + depositParams.submissionChallengeBaseDeposit,
          }
        )
        break
      case 'Registered':
        transactionResponse = await contract.removeItem(
          itemDetails.itemID,
          ipfsURL,
          {
            value: arbitrationCost + depositParams.removalBaseDeposit,
          }
        )
        break
      case 'ClearingRequested':
        transactionResponse = await contract.challengeRequest(
          itemDetails.itemID,
          ipfsURL,
          {
            value: arbitrationCost + depositParams.removalChallengeBaseDeposit,
          }
        )
        break
      default:
        throw new Error(`Unknown request type: ${requestType}`)
    }

    console.log('Transaction hash:', transactionResponse.hash)
    // Wait for the transaction to be confirmed
    const receipt = await transactionResponse.wait()
    console.log('Transaction was mined in block', receipt.blockNumber)

    return true
  } catch (error) {
    console.error('Error submitting evidence:', error)
    return false
  }
}
