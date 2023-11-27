import { toast } from 'react-toastify'

export const handleImageUpload = async (
  event: React.ChangeEvent<HTMLInputElement>,
  setIsImageUploadSuccessful,
  activeList
) => {
  setIsImageUploadSuccessful(false)

  let file
  if (event.target.files && event.target.files.length > 0) {
    file = event.target.files[0]
  } else return

  if (!file) return

  // Check if the file is a PNG
  if (file.type !== 'image/png') {
    toast.error('Please upload a PNG file.')
    return
  }

  const img = new Image()
  img.onload = async () => {
    // Check dimensions
    const minWidth = 100 // Set your expected width
    const minHeight = 100 // Set your expected height
    console.log(img.width, img.height)
    if (img.width <= minWidth || img.height <= minHeight) {
      toast.error(`Image dimensions should be ${minWidth}x${minHeight}.`)
      return
    }

    // Check for transparency
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      console.error('Failed to get 2D context from canvas')
      return
    }

    canvas.width = img.width
    canvas.height = img.height

    ctx.drawImage(img, 0, 0)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    let isTransparent = false
    for (let i = 0; i < imageData.data.length; i += 4) {
      if (imageData.data[i + 3] < 255) {
        isTransparent = true
        break
      }
    }

    if (!isTransparent) {
      toast.error('The image must have transparency.')
      return
    }

    // If all checks pass, proceed to upload
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)

    reader.onload = async () => {
      if (reader.result instanceof ArrayBuffer) {
        const buffer_data = Array.from(new Uint8Array(reader.result))

        const final_dict = {
          fileName: 'image.png',
          buffer: { type: 'Buffer', data: buffer_data },
        }

        try {
          const response = await fetch('https://ipfs.kleros.io/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(final_dict),
          })

          const responseData = await response.json()
          console.log('Upload results: ' + responseData)
          if (responseData && responseData.data[0].hash) {
            let visualProofElement
            switch (activeList) {
              case 'CDN':
                visualProofElement = document.getElementById('visualProof')
                break
              case 'Tokens':
                visualProofElement = document.getElementById('logoImage')
            }
            if (visualProofElement) {
              visualProofElement.setAttribute(
                'data-uri',
                '/ipfs/' + responseData.data[0].hash
              )
              setIsImageUploadSuccessful(true)
            }
          }
        } catch (error) {
          console.error('Failed to upload image to IPFS:', error)
        }
      }
    }
  }

  // Set the src of the image to the uploaded file to trigger onload
  img.src = URL.createObjectURL(file)
}
