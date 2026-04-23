import logo from './logo.svg';
import './App.css';
import Landing from './components/Landing';
import Home from './Pages/Home';
import '@fortawesome/fontawesome-free/css/all.min.css'
import CategoryResults from './Pages/Categories';
import { Routes,Route } from 'react-router-dom';

function App() {
  return (
    <div className="App pt-[120px]">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/category/:id' element={<CategoryResults />} />
      </Routes>
   
    </div>
  );
}

export default App;
