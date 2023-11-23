import AddressDisplay from 'components/AddressDisplay'

export const renderValue = (key: any, value: any) => {
  if (typeof value === 'string') {
    if (value.startsWith('/ipfs/')) {
      return (
        <img
          style={{ width: '30%' }}
          src={`https://ipfs.kleros.io${value}`}
          alt={key}
        />
      )
    } else if (
      ['Address', 'Contract Address', 'Contract address'].includes(key)
    ) {
      return <AddressDisplay address={value} />
    }
  }
  return value // default case
}
