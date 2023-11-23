import React from 'react'

interface IDescription {}

const Description: React.FC<IDescription> = ({}) => {
  return (
    <p className="text-xl text-center text-purple-300 mb-12">
      Crowdsourced contract metadata for the Ethereum ecosystem.
    </p>
  )
}
export default Description
