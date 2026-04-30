import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home';
import Auth from './Pages/Auth';
import Categories from './Pages/Categories';
import CategoryResults from './Pages/CategoryResults';
import ProviderOnboardingGate from './Pages/ProviderOnboardingGate';
import ProviderOnboardingStep1Profile from './Pages/ProviderOnboardingStep1Profile';
import ProviderOnboardingStep2Verification from './Pages/ProviderOnboardingStep2Verification';
import ProviderOnboardingStep3Review from './Pages/ProviderOnboardingStep3Review';
import '@fortawesome/fontawesome-free/css/all.min.css'
import ProviderProfile from './Pages/ProviderProfile';
import About from './Pages/About';
import Contact from './Pages/Contact';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
        <Route path="/signin" element={<Auth />} />
        <Route path="/get-started" element={<Auth />} />
        <Route path="/provider/:id" element={<ProviderProfile/>} />
        <Route path="/become-provider" element={<Navigate to="/provider-onboarding/profile" replace />} />
        <Route path="/category/:id" element={<Categories />} />
        <Route path="/category-results" element={<CategoryResults />} />
        <Route path="/provider/onboarding" element={<ProviderOnboardingGate />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        
        
        <Route path="/provider-onboarding/profile" element={<ProviderOnboardingStep1Profile />} />
        <Route path="/provider-onboarding/verification" element={<ProviderOnboardingStep2Verification />} />
        <Route path="/provider-onboarding/review" element={<ProviderOnboardingStep3Review />} />
      </Routes>
    </div>
  );
}

export default App;