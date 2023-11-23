import React from 'react'

interface IFooter {}

const Footer: React.FC<IFooter> = ({}) => {
  return (
    <footer className="mt-16 text-center text-purple-400 text-sm">
      © 2023 Kleros Tags. All rights reserved.
    </footer>
  )
}
export default Footer
