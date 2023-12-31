import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo } from 'react'
import { useSearchParams, createSearchParams } from 'react-router-dom'
import { fetchItems } from '~src/utils/fetchItems'
import Header from './Header'
import styled from 'styled-components'
import RegistryDetails from './RegistryDetails'
import SubmitEntries from './SubmitEntries'
import Search from './Search'
import LoadingItems from './LoadingItems'
import EntriesList from './EntriesList'
import Footer from '~src/components/Footer'
import Pagination from './Pagination'
import { fetchItemCounts } from '~src/utils/itemCounts'
import DetailsModal from './DetailsModal'
import Filters from './Filters'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #5a2393;
  min-height: 100vh;
  color: white;
  padding: 32px;
`

export const ITEMS_PER_PAGE = 20

const Home: React.FC = () => {
  let [searchParams, setSearchParams] = useSearchParams()

  const searchQueryKeys = useMemo(
    () => [
      searchParams.getAll('registry').toString(),
      searchParams.getAll('status').toString(),
      searchParams.getAll('disputed').toString(),
      searchParams.getAll('network').toString(),
      searchParams.get('text'),
      searchParams.get('page'),
      searchParams.get('orderDirection'),
    ],
    [searchParams]
  )

  const isDetailsModalOpen = useMemo(
    () => !!searchParams.get('itemdetails'),
    [searchParams]
  )

  const {
    isLoading: searchLoading,
    error: searchError,
    data: searchData,
  } = useQuery({
    queryKey: ['fetch', ...searchQueryKeys],
    queryFn: () => fetchItems(searchParams),
  })
  const {
    isLoading: countsLoading,
    error: countsError,
    data: countsData,
  } = useQuery({
    queryKey: ['counts', ...searchQueryKeys],
    queryFn: () => fetchItemCounts(),
  })

  const currentItemCount = useMemo(() => {
    const registry = searchParams.getAll('registry')
    const status = searchParams.getAll('status')
    const disputed = searchParams.getAll('disputed')
    const network = searchParams.getAll('network')
    const text = searchParams.get('text')
    const page = searchParams.get('page')
    if (
      countsLoading ||
      registry.length === 0 ||
      status.length === 0 ||
      disputed.length === 0 ||
      network.length === 0 ||
      page === null ||
      !countsData
    ) {
      // defaults or counts unloaded yet
      return undefined
    } else if (!text && network.length === 4) {
      // can use the subgraph category counts.
      const getCount = (registry: 'Tags' | 'Tokens' | 'CDN') => {
        return (
          (status.includes('Absent') && disputed.includes('false')
            ? countsData[registry].numberOfAbsent
            : 0) +
          (status.includes('Registered') && disputed.includes('false')
            ? countsData[registry].numberOfRegistered
            : 0) +
          (status.includes('RegistrationRequested') &&
          disputed.includes('false')
            ? countsData[registry].numberOfRegistrationRequested
            : 0) +
          (status.includes('RegistrationRequested') && disputed.includes('true')
            ? countsData[registry].numberOfChallengedRegistrations
            : 0) +
          (status.includes('ClearingRequested') && disputed.includes('false')
            ? countsData[registry].numberOfClearingRequested
            : 0) +
          (status.includes('ClearingRequested') && disputed.includes('true')
            ? countsData[registry].numberOfChallengedClearing
            : 0)
        )
      }

      const count =
        (registry.includes('Tags') ? getCount('Tags') : 0) +
        (registry.includes('CDN') ? getCount('CDN') : 0) +
        (registry.includes('Tokens') ? getCount('Tokens') : 0)
      return count
    } else {
      // complex query. can only be known if last query has >21 items.
      // o.w nullify.
      if (!searchData || searchData.length > ITEMS_PER_PAGE) return null
      else {
        // for each previous page, thats guaranteed 20 items
        // + remainder of last page
        return searchData.length + (Number(page) - 1) * ITEMS_PER_PAGE
      }
    }
  }, [searchParams, countsData, countsLoading, searchData])

  // If missing search params, insert defaults.
  useEffect(() => {
    const registry = searchParams.getAll('registry')
    const status = searchParams.getAll('status')
    const disputed = searchParams.getAll('disputed')
    const network = searchParams.getAll('network')
    const text = searchParams.get('text')
    const page = searchParams.get('page')
    const orderDirection = searchParams.get('orderDirection')
    if (
      registry.length === 0 ||
      status.length === 0 ||
      disputed.length === 0 ||
      network.length === 0 ||
      orderDirection === null ||
      page === null
    ) {
      const newSearchParams = createSearchParams({
        registry: registry.length === 0 ? ['Tags'] : registry,
        status:
          status.length === 0
            ? ['Registered', 'RegistrationRequested', 'ClearingRequested']
            : status,
        disputed: disputed.length === 0 ? ['true', 'false'] : disputed,
        network: network.length === 0 ? ['1', '100', '137', '56'] : network,
        text: text === null ? '' : text,
        page: page === null ? '1' : page,
        orderDirection: orderDirection === null ? 'desc' : orderDirection,
      })
      setSearchParams(newSearchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const totalPages =
    currentItemCount !== null && currentItemCount !== undefined
      ? Math.ceil(currentItemCount / ITEMS_PER_PAGE)
      : null // in complex query, cannot provide this information

  return (
    <Container>
      <Header />
      <RegistryDetails
        loading={searchLoading}
        itemCount={
          currentItemCount === null || currentItemCount === undefined
            ? null
            : currentItemCount
        }
      />
      <SubmitEntries />
      <Search />
      <Filters />

      {searchLoading || !searchData ? (
        <LoadingItems />
      ) : (
        <EntriesList searchData={searchData} />
      )}
      <Pagination totalPages={totalPages} />
      <Footer />

      {isDetailsModalOpen && <DetailsModal />}
    </Container>
  )
}

export default Home
