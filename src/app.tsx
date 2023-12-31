import React, { useRef } from 'react'
import styled from 'styled-components'
import 'overlayscrollbars/styles/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { OverlayScrollContext } from 'context/OverlayScrollContext'
import Home from '~src/pages/Home'
import StyledComponentsProvider from 'context/StyledComponentsProvider'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const StyledOverlayScrollbarsComponent = styled(OverlayScrollbarsComponent)`
  height: 100vh;
  width: 100vw;
`
const queryClient = new QueryClient()

const App: React.FC = () => {
  const containerRef = useRef(null)

  return (
    <OverlayScrollContext.Provider value={containerRef}>
      <StyledOverlayScrollbarsComponent
        ref={containerRef}
        options={{ showNativeOverlaidScrollbars: true }}
      >
        <StyledComponentsProvider>
          <QueryClientProvider client={queryClient}>
            <Home />
          </QueryClientProvider>
        </StyledComponentsProvider>
      </StyledOverlayScrollbarsComponent>
    </OverlayScrollContext.Provider>
  )
}

export default App
