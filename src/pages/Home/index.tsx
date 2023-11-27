import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Contract, JsonRpcProvider, formatEther } from 'ethers'
import 'react-toastify/dist/ReactToastify.css'
import arbitratorABI from 'utils/abi/kleros-liquid-abi.json'

import { fetchTags } from 'utils/getAddressTagsFromSubgraph'
import { fetchCDN } from 'utils/getCDNFromSubgraph'
import { fetchTokens } from 'utils/getTokensFromSubgraph'
import { DepositParamsType } from 'utils/performEvidenceBasedRequest'
import klerosCurateABI from 'utils/abi/kleros-curate-abi.json'
import Header from './Header'
import Search from './Search'
import EntriesList from './EntriesList'
import LoadingItems from './LoadingItems'
import Pagination from './Pagination'
import Footer from 'components/Footer'
import DetailsModal from './DetailsModal'
import RegistryDetails from './RegistryDetails'
import SubmitEntries from './SubmitEntries'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #5a2393;
  min-height: 100vh;
  margin: 0 auto;
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

  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  //navigation and search
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  //for the pop-up to display details and evidence
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const [detailsData, setDetailsData] = useState(null)
  const [evidences, setEvidences] = useState<any[]>([])
  const [entryStatus, setEntryStatus] = useState('')
  const [itemId, setItemId] = useState('')

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

  return (
    <Container>
      <Header activeList={activeList} setActiveList={setActiveList} />
      <RegistryDetails loading={loading} filteredData={filteredData} />
      <SubmitEntries
        activeList={activeList}
        depositParams={depositParams}
        curateContractAddress={curateContractAddress}
      />
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
