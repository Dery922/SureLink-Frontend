import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import CategoryResults from './Pages/CategoryResults'
import CustomerOnboardingGate from './Pages/CustomerOnboardingGate';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:id" element={<CategoryResults />} />
      <Route
        path="/customer/onboarding"
        element={<CustomerOnboardingGate />}
      />
    </Routes>
  )
}

export default App