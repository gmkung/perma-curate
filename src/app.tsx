import React, { useRef } from 'react'
import styled from 'styled-components'
import { Route, Routes } from 'react-router-dom'
import 'overlayscrollbars/styles/overlayscrollbars.css'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { OverlayScrollContext } from 'context/OverlayScrollContext'
import Home from 'pages/Home'
import StyledComponentsProvider from 'context/StyledComponentsProvider'

const StyledOverlayScrollbarsComponent = styled(OverlayScrollbarsComponent)`
  height: 100vh;
  width: 100vw;
`

const App: React.FC = () => {
  const containerRef = useRef(null)

  return (
    <OverlayScrollContext.Provider value={containerRef}>
      <StyledOverlayScrollbarsComponent
        ref={containerRef}
        options={{ showNativeOverlaidScrollbars: true }}
      >
        <StyledComponentsProvider>
          <Routes>
            <Route index element={<Home items={undefined} />} />
          </Routes>
        </StyledComponentsProvider>
      </StyledOverlayScrollbarsComponent>
    </OverlayScrollContext.Provider>
  )
}

export default App
