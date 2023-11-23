export const fetchFromIPFS = async (ipfsURI: string) => {
  try {
    const response = await fetch(`https://ipfs.kleros.io${ipfsURI}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch from IPFS:', error)
  }
}
