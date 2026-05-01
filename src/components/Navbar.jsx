import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { usuario } = useAuth()

  return (
    <nav className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">

      <Link to="/" className="text-2xl font-bold text-sky-500">
        🏥 Jelfen
      </Link>

      <div className="flex gap-6 text-gray-600 font-medium">
        <Link to="/" className="hover:text-sky-500">Principal</Link>
        <Link to="/doctores" className="hover:text-sky-500">Doctores</Link>
      
        <Link to="/contacto" className="hover:text-sky-500">Contáctanos</Link>
      </div>

      <div className="flex gap-3 items-center">
        <Link to="/registro" className="border border-sky-500 text-sky-500 px-4 py-2 rounded-full hover:bg-sky-50 font-medium">
          Soy Médico
        </Link>

        {usuario ? (
          <Link to="/dashboard" className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 font-medium">
            <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
              {usuario.avatar}
            </div>
            {usuario.nombre.split(' ')[0]}
          </Link>
        ) : (
          <Link to="/login" className="bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 font-medium">
            Iniciar Sesión
          </Link>
        )}
      </div>

    </nav>
  )
}

export default Navbar