import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CategoryResults from './pages/CategoryResults'
import ProviderProfile from './pages/ProviderProfile'
import BookingFlow from './Pages/BookingFlow'
import BookingConfirmation from './pages/BookingConfirmation'
import ProviderDashboard from './pages/ProviderDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<CategoryResults />} />
      <Route path="/provider/:id" element={<ProviderProfile />} />
      <Route path="/booking/:providerId" element={<BookingFlow />} />
      <Route path="/booking-confirmation/:providerId" element={<BookingConfirmation />} />
      <Route path="/provider/dashboard" element={<ProviderDashboard />} />
    </Routes>
  )
}

export default App