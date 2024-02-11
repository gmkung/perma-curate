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
  console.log('from fetchArbitrationCost', { arbitrator, arbitratorExtraData })
  if (!arbitrator || !arbitratorExtraData) return undefined

  const provider = new ethers.JsonRpcProvider('https://rpc.gnosischain.com')
  console.log("fetchArbCost provider created")
  const arbitratorContract = new Contract(arbitrator, ArbitratorABI, provider)
  console.log("contract created, calling func")
  const arbitrationCost = await arbitratorContract.arbitrationCost(
    arbitratorExtraData
  )

  return arbitrationCost
}
