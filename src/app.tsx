import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import StyledComponentsProvider from './context/StyledComponentsProvider'

const App: React.FC = () => {
  return (
    <StyledComponentsProvider>
      <Routes>
        <Route index element={<Home items={undefined} />} />
      </Routes>
    </StyledComponentsProvider>
  )
}

export default App
