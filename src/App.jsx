import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import DoctorSearch from './pages/DoctorSearch'
import DoctorRegister from './pages/DoctorRegister'
import DoctorProfile from './pages/DoctorProfile'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/buscar" element={<DoctorSearch />} />
        <Route path="/registro" element={<DoctorRegister />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
      </Routes>
      <ChatBot />
    </BrowserRouter>
  )
}

export default App