import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Contract, JsonRpcProvider, formatEther } from 'ethers'
import arbitratorABI from '../../utils/abi/kleros-liquid-abi.json'
import tagsItemTemplate from '../../assets/tags-item-template.json'
import CDNItemTemplate from '../../assets/cdn-item-template.json'
import tokensItemTemplate from '../../assets/tokens-item-template.json'
import { fetchTags } from '../../utils/getAddressTagsFromSubgraph'
import { fetchCDN } from '../../utils/getCDNFromSubgraph'
import { fetchTokens } from '../../utils/getTokensFromSubgraph'
import { DepositParamsType } from '../../utils/performEvidenceBasedRequest'
import klerosCurateABI from '../../utils/abi/kleros-curate-abi.json'
import { postJsonToKlerosIpfs } from '../../utils/postJsonToKlerosIpfs'
import { initiateTransactionToCurate } from '../../utils/initiateTransactionToCurate'
import Header from './Header'
import Search from './Search'
import EntriesList from './EntriesList'
import LoadingItems from './LoadingItems'
import Pagination from './Pagination'
import Footer from './Footer'
import AddEntryModal from './AddEntryModal'
import DetailsModal from './DetailsModal'
import Description from './Description'
import TotalNumberOfEntries from './TotalNumberOfEntries'

const Container = styled.div`
  background: linear-gradient(to bottom right, #6b46c1, #553c9a);
  min-height: 100vh;
  width: 100vw;
  color: white;
  padding: 32px;
`

declare global {
  interface Window {
    ethereum: any
  }
}

const Home = ({}: { items: any }) => {
  //Initiation
  const [activeList, setActiveList] = useState<'Tags' | 'CDN' | 'Tokens'>(
    'Tags'
  )
  const [registryDropdownOpen, setRegistryDropdownOpen] = useState(false)

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  //navigation and search
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  //for the pop-up to display details and evidence
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const [detailsData, setDetailsData] = useState(null)
  const [evidences, setEvidences] = useState<any[]>([])
  const [entryStatus, setEntryStatus] = useState('')
  const [itemId, setItemId] = useState('')
  const [isImageUploadSuccessful, setIsImageUploadSuccessful] = useState(false)

  //contract state management
  const [curateContractAddress, setCurateContractAddress] = useState('')
  const [depositParams, setDepositParams] = useState<DepositParamsType>(null)

  useEffect(() => {
    switch (activeList) {
      case 'Tags':
        setCurateContractAddress('0x66260C69d03837016d88c9877e61e08Ef74C59F2')
        break
      case 'CDN':
        setCurateContractAddress('0x957a53a994860be4750810131d9c876b2f52d6e1')
        break
      case 'Tokens':
        setCurateContractAddress('0xee1502e29795ef6c2d60f8d7120596abe3bad990')
        break
      default:
        console.error('Invalid active list type:', activeList)
    }
  }, [activeList])

  useEffect(() => {
    const ARBITRATORCONTRACTADDRESS =
      '0x9C1dA9A04925bDfDedf0f6421bC7EEa8305F9002'
    const PROVIDER = new JsonRpcProvider('https://rpc.ankr.com/gnosis')
    const CONTRACT = new Contract(
      curateContractAddress,
      klerosCurateABI,
      PROVIDER
    )
    const ARBCONTRACT = new Contract(
      ARBITRATORCONTRACTADDRESS,
      arbitratorABI,
      PROVIDER
    )

    let isMounted = true // To handle cleanup

    CONTRACT.arbitratorExtraData()
      .then((result) => {
        const arbitratorExtraData = result
        return Promise.all([
          CONTRACT.submissionBaseDeposit(),
          CONTRACT.submissionChallengeBaseDeposit(),
          CONTRACT.removalBaseDeposit(),
          CONTRACT.removalChallengeBaseDeposit(),
          ARBCONTRACT.arbitrationCost(arbitratorExtraData),
        ])
      })
      .then((results) => {
        if (isMounted) {
          // Only update state if component is still mounted
          setDepositParams({
            submissionBaseDeposit: parseFloat(formatEther(results[0])),
            submissionChallengeBaseDeposit: parseFloat(formatEther(results[1])),
            removalBaseDeposit: parseFloat(formatEther(results[2])),
            removalChallengeBaseDeposit: parseFloat(formatEther(results[3])),
            arbitrationCost: parseFloat(formatEther(results[4])),
          })
          console.log('DONE')
        }
      })
      .catch((error) => {
        console.error('Error fetching deposit params:', error)
      })

    return () => {
      isMounted = false // Cleanup
    }
  }, [curateContractAddress])

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let fetchedItems
        setItems([])
        setLoading(true)
        switch (activeList) {
          case 'Tags':
            fetchedItems = await fetchTags() // Assuming fetchTags fetches for Tags
            break
          case 'CDN':
            fetchedItems = await fetchCDN() // Create a fetchCDN function
            break
          case 'Tokens':
            fetchedItems = await fetchTokens() // Create a fetchTokens function
            break
        }
        setItems(fetchedItems as any)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [activeList])

  const itemsPerPage = 20

  // Filter and paginate data
  const filteredData = items.filter((item: any) => {
    for (let key in item) {
      if (typeof item[key] === 'string' && item[key].includes(searchTerm)) {
        return true
      } else if (
        typeof item[key] === 'number' &&
        item[key].toString().includes(searchTerm)
      ) {
        return true
      }
      // Add more conditions if there are other data types to consider.
    }
    return false
  })

  const displayedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  //For pagination

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleFormSubmit = async (event: any) => {
    event.preventDefault()
    // Check if depositParams is null and throw an error if it is

    if (!depositParams) {
      throw new Error('depositParams is null')
    }

    const formData = new FormData(event.target)
    let dataObject = {}

    switch (activeList) {
      case 'Tags':
        dataObject = {
          'Contract Address': formData.get('contractAddress'),
          'Public Name Tag': formData.get('publicNameTag'),
          'Project Name': formData.get('projectName'),
          'UI/Website Link': formData.get('uiLink'),
          'Public Note': formData.get('publicNote'),
        }
        break
      case 'CDN':
        dataObject = {
          'Contract Address': formData.get('contractAddress'),
          'Domain name': formData.get('domainName'),
          'Visual proof': document
            .getElementById('visualProof')
            ?.getAttribute('data-uri'),
        }
        break
      case 'Tokens':
        dataObject = {
          Address: formData.get('contractAddress'),
          Name: formData.get('name'),
          Symbol: formData.get('symbol'),
          Decimals: formData.get('decimals'),
          Logo: document.getElementById('logoImage')?.getAttribute('data-uri'),
        }
        break

      default:
        console.error('Invalid active list type:', activeList)
    }

    const formattedData = {
      ...(activeList === 'Tags'
        ? tagsItemTemplate
        : activeList === 'CDN'
        ? CDNItemTemplate
        : activeList === 'Tokens'
        ? tokensItemTemplate
        : {}),
      values: dataObject,
    }
    console.log(formattedData)

    // Step 3: Store the JSON object in IPFS using Kleros's node
    const ipfsPath = await postJsonToKlerosIpfs(formattedData)
    console.log(ipfsPath)

    // Step 4: Initiate a transaction to Curate's contract (Placeholder)
    // You will need a function that interacts with the Ethereum blockchain to submit the data to Curate's contract.
    const transactionSuccess = await initiateTransactionToCurate(
      curateContractAddress,
      depositParams,
      ipfsPath
    )

    // Step 5: Close the pop-up
    if (transactionSuccess) {
      // Only close the modal if the transaction was successful
      setIsModalOpen(false)
    } else {
      // Optionally, show an error message to the user here
      console.error('Transaction failed.')
    }
  }

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsImageUploadSuccessful(false)

    let file
    if (event.target.files && event.target.files.length > 0) {
      file = event.target.files[0]
    } else return

    if (!file) return

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

  return (
    <Container>
      <Header
        activeList={activeList}
        setRegistryDropdownOpen={setRegistryDropdownOpen}
        setActiveList={setActiveList}
        registryDropdownOpen={registryDropdownOpen}
      />
      <Description />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <TotalNumberOfEntries
        loading={loading}
        filteredData={filteredData}
        setIsModalOpen={setIsModalOpen}
      />
      {loading ? (
        <LoadingItems />
      ) : (
        <EntriesList
          displayedData={displayedData}
          activeList={activeList}
          setDetailsData={setDetailsData}
          setEvidences={setEvidences}
          setEntryStatus={setEntryStatus}
          setItemId={setItemId}
          setIsDetailsModalOpen={setIsDetailsModalOpen}
        />
      )}
      <Pagination totalPages={totalPages} setCurrentPage={setCurrentPage} />
      <Footer />
      {isModalOpen && (
        <AddEntryModal
          setIsModalOpen={setIsModalOpen}
          handleFormSubmit={handleFormSubmit}
          activeList={activeList}
          handleImageUpload={handleImageUpload}
          depositParams={depositParams}
          isImageUploadSuccessful={isImageUploadSuccessful}
        />
      )}
      {isDetailsModalOpen && (
        <DetailsModal
          setIsDetailsModalOpen={setIsDetailsModalOpen}
          curateContractAddress={curateContractAddress}
          depositParams={depositParams}
          itemId={itemId}
          entryStatus={entryStatus}
          detailsData={detailsData}
          evidences={evidences}
        />
      )}
    </Container>
  )
}

export default Home
