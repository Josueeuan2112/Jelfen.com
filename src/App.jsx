import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import Nosotros from './pages/Nosotros'
import Home from './pages/Home'
import DoctorSearch from './pages/DoctorSearch'
import DoctorRegister from './pages/DoctorRegister'
import DoctorProfile from './pages/DoctorProfile'
import Contacto from './pages/Contacto'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Nosotros />} />
        <Route path="/doctores" element={<Home />} />
        <Route path="/buscar" element={<DoctorSearch />} />
        <Route path="/registro" element={<DoctorRegister />} />
        <Route path="/doctor/:id" element={<DoctorProfile />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
      <ChatBot />
    </BrowserRouter>
  )
}

export default App