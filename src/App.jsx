import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryResults from './pages/CategoryResults'
import ProviderProfile from './pages/ProviderProfile'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<CategoryResults />} />
      <Route path="/provider/:id" element={<ProviderProfile />} />
      
    </Routes>
  )
}

export default App