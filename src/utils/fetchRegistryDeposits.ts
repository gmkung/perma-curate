import { Contract, ethers } from 'ethers'

export interface DepositParams {
  submissionBaseDeposit: bigint
  submissionChallengeBaseDeposit: bigint
  removalBaseDeposit: bigint
  removalChallengeBaseDeposit: bigint
}

const LGTCRViewABI = [
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '_address', type: 'address' }],
    name: 'fetchArbitrable',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'governor', type: 'address' },
          { internalType: 'address', name: 'arbitrator', type: 'address' },
          { internalType: 'bytes', name: 'arbitratorExtraData', type: 'bytes' },
          {
            internalType: 'uint256',
            name: 'submissionBaseDeposit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'removalBaseDeposit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'submissionChallengeBaseDeposit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'removalChallengeBaseDeposit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'challengePeriodDuration',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'metaEvidenceUpdates',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'winnerStakeMultiplier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'loserStakeMultiplier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'sharedStakeMultiplier',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'MULTIPLIER_DIVISOR',
            type: 'uint256',
          },
          { internalType: 'uint256', name: 'arbitrationCost', type: 'uint256' },
        ],
        internalType: 'struct LightGeneralizedTCRView.ArbitrableData',
        name: 'result',
        type: 'tuple',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

const LGTCRViewAddress = '0xB32e38B08FcC7b7610490f764b0F9bFd754dCE53'

export const fetchRegistryDeposits = async (
  registry: string
): Promise<DepositParams | undefined> => {
  // registry still unknown
  console.log('from fetchRegistryDeposits', { registry })
  if (!registry) return undefined
  console.log("survived falsy check in fetchRegistryDeposits")

  const provider = new ethers.JsonRpcProvider("https://rpc.gnosischain.com")
  console.log("fetchRegistryDeposits provider created")

  const lgtcrViewContract = new Contract(
    LGTCRViewAddress,
    LGTCRViewABI,
    provider
  )
  console.log("contract created, calling func")
  const viewInfo = await lgtcrViewContract.fetchArbitrable(registry)
  const depositParams: DepositParams = {
    submissionBaseDeposit: viewInfo.submissionBaseDeposit,
    submissionChallengeBaseDeposit: viewInfo.submissionChallengeBaseDeposit,
    removalBaseDeposit: viewInfo.removalBaseDeposit,
    removalChallengeBaseDeposit: viewInfo.removalChallengeBaseDeposit,
  }
  return depositParams
}
