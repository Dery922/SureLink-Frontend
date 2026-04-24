import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Auth from './Pages/Auth';
import Categories from './Pages/Categories';
import ProviderOnboardingGate from './Pages/ProviderOnboardingGate';
import ProviderOnboardingStep1Profile from './Pages/ProviderOnboardingStep1Profile';
import ProviderOnboardingStep2Verification from './Pages/ProviderOnboardingStep2Verification';
import ProviderOnboardingStep3Review from './Pages/ProviderOnboardingStep3Review';
import '@fortawesome/fontawesome-free/css/all.min.css'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/get-started" element={<Auth />} />
        <Route path="/become-provider" element={<Navigate to="/provider-onboarding/profile" replace />} />
        <Route path="/category/:id" element={<Categories />} />
        <Route path="/provider/onboarding" element={<ProviderOnboardingGate />} />
        <Route path="/provider-onboarding/profile" element={<ProviderOnboardingStep1Profile />} />
        <Route path="/provider-onboarding/verification" element={<ProviderOnboardingStep2Verification />} />
        <Route path="/provider-onboarding/review" element={<ProviderOnboardingStep3Review />} />
      </Routes>
    </div>
  );
}

export default App;
