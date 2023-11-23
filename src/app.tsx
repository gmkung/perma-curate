import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import StyledComponentsProvider from './context/StyledComponentsProvider'

const App: React.FC = () => {
  return (
    <StyledComponentsProvider>
      <Routes>
        <Route index element={<Home items={undefined} />} />

        <Route
          path="*"
          element={<h1>Justice not found here ¯\_( ͡° ͜ʖ ͡°)_/¯</h1>}
        />
      </Routes>
    </StyledComponentsProvider>
  )
}

export default App
