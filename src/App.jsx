import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryResults from './pages/CategoryResults'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<CategoryResults />} />
    </Routes>
  )
}

export default App