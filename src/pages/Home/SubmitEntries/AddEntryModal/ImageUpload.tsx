import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ipfsPublish from 'utils/ipfsPublish'

const ImageUpload: React.FC<{
  path: string
  setPath: Dispatch<SetStateAction<string>>
}> = (p) => {
  const [imageFile, setImageFile] = useState<any>()

  useEffect(() => {
    if (!imageFile) return
    const ipfsBlablabla = async () => {
      const data = await new Response(new Blob([imageFile])).arrayBuffer()

      const path = await ipfsPublish(imageFile.name as string, data)
      console.log({ path })
      p.setPath(path)
    }
    ipfsBlablabla()
  }, [imageFile])

  return (
    <>
      Image
      <input
        type="file"
        onChange={(e) => {
          setImageFile(e.target.files ? e.target.files[0] : null)
        }}
      />
      {p.path && (
        <img
          width={200}
          height={200}
          src={`https://ipfs.kleros.io${p.path}`}
          alt="preview"
        />
      )}
    </>
  )
}

export default ImageUpload
