import { Contract, ethers } from 'ethers'

const ArbitratorABI = [
  {
    constant: true,
    inputs: [{ name: '_extraData', type: 'bytes' }],
    name: 'arbitrationCost',
    outputs: [{ name: 'cost', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
]

export const fetchArbitrationCost = async (
  arbitrator: string,
  arbitratorExtraData: string
): Promise<bigint | undefined> => {
  // itemDetails still unknown
  if (!arbitrator || !arbitratorExtraData) return undefined

  try {
    const provider = new ethers.JsonRpcProvider(
      'https://rpc.gnosischain.com',
      100
    )

    const arbitratorContract = new Contract(arbitrator, ArbitratorABI, provider)

    const arbitrationCost = await arbitratorContract.arbitrationCost(
      arbitratorExtraData
    )

    return arbitrationCost
  } catch (e) {
    console.log('fetchArbitrationCost error!', e)
    return undefined
  }
}
