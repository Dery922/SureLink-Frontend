import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryResults from './pages/CategoryResults'
import ProviderProfile from './pages/ProviderProfile'
import BookingFlow from './Pages/BookingFlow'
import BookingConfirmation from './pages/BookingConfirmation'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<CategoryResults />} />
      <Route path="/provider/:id" element={<ProviderProfile />} />
      <Route path="/booking/:providerId" element={<BookingFlow />} />
      <Route path="/booking-confirmation/:providerId" element={<BookingConfirmation />} />
    </Routes>
  )
}

export default App