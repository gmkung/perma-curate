import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import styled from 'styled-components'
import ipfsPublish from 'utils/ipfsPublish'

const StyledLabel = styled.label`
  cursor: pointer;
  width: 100px;
  display: inline-block;
  padding: 10px 20px;
  background-color: #855caf;
  color: white;
  border-radius: 12px;
  position: relative;
  &:hover {
    background-color: #9277b1;
  }
`

const StyledInput = styled.input`
  opacity: 0;
  width: 0.1px;
  height: 0.1px;
  position: absolute;
`

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
      <StyledLabel>
        Upload Image
        <StyledInput
          type="file"
          onChange={(e) => {
            setImageFile(e.target.files ? e.target.files[0] : null)
          }}
        />
      </StyledLabel>
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
