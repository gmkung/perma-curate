import { postJsonToKlerosIpfs } from './postJsonToKlerosIpfs'
import { Contract, ethers } from 'ethers'
import klerosCurateABI from './abi/kleros-curate-abi.json'

export type DepositParamsType = {
  submissionBaseDeposit: number
  submissionChallengeBaseDeposit: number
  removalBaseDeposit: number
  removalChallengeBaseDeposit: number
  arbitrationCost: number
} | null

export async function performEvidenceBasedRequest(
  curateContractAddress: string,
  depositParams: DepositParamsType,
  itemId: string,
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
      title: evidenceTitle, // Add your desired title
      description: evidenceText,
    }

    // Post the JSON object to Kleros IPFS
    const ipfsURL = await postJsonToKlerosIpfs(evidenceObject)
    console.log('Evidence URL: ', ipfsURL)

    // Ensure MetaMask or an equivalent provider is available
    if (!window.ethereum) {
      throw new Error('Ethereum provider not found!')
    }

    // Initialize the provider from MetaMask or any injected Ethereum provider
    //const provider = new Web3Provider(window.ethereum);//
    const provider = new ethers.BrowserProvider(window.ethereum)

    //const signer = provider.getSigner();
    const signer = await provider.getSigner()
    // Prompt the user to connect their wallet
    await window.ethereum.request({ method: 'eth_requestAccounts' })

    // Create an instance of the contract
    const contract = new Contract(
      curateContractAddress,
      klerosCurateABI,
      signer
    )

    let transactionResponse
    let etherAmount

    switch (requestType) {
      case 'Evidence':
        etherAmount = ethers.parseEther('0') // adjust the ether amount calculation as needed
        transactionResponse = await contract.submitEvidence(itemId, ipfsURL, {
          value: etherAmount,
        })
        break
      case 'RegistrationRequested':
        etherAmount = ethers.parseEther(
          (
            depositParams.arbitrationCost +
            depositParams.submissionChallengeBaseDeposit
          ).toString()
        ) // adjust the ether amount calculation as needed
        transactionResponse = await contract.challengeRequest(itemId, ipfsURL, {
          value: etherAmount,
        })
        break
      case 'Registered':
        etherAmount = ethers.parseEther(
          (
            depositParams.arbitrationCost + depositParams.removalBaseDeposit
          ).toString()
        ) // adjust the ether amount calculation as needed
        transactionResponse = await contract.removeItem(itemId, ipfsURL, {
          value: etherAmount,
        })
        break
      case 'ClearingRequested':
        etherAmount = ethers.parseEther(
          (
            depositParams.arbitrationCost +
            depositParams.removalChallengeBaseDeposit
          ).toString()
        ) // adjust the ether amount calculation as needed
        transactionResponse = await contract.challengeRequest(itemId, ipfsURL, {
          value: etherAmount,
        })
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
