export const postJsonToKlerosIpfs = async (object: Record<string, any>) => {
  const json_string = JSON.stringify(object)
  const json_bytes = new TextEncoder().encode(json_string)
  const buffer_data = Array.from(json_bytes)

  const final_dict = {
    fileName: 'evidence.json',
    buffer: { type: 'Buffer', data: buffer_data },
  }

  const response = await fetch('https://ipfs.kleros.io/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(final_dict),
  })

  if (response.ok) {
    const data = await response.json()
    return '/ipfs/' + data.data[0].hash
  } else {
    throw new Error('Failed to upload to IPFS')
  }
}
