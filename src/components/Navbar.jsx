import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { usuario } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/', label: 'Principal' },
    { to: '/doctores', label: 'Doctores' },
    { to: '/contacto', label: 'Contáctanos' },
  ]

  const esActivo = (ruta) => location.pathname === ruta

  return (
    <nav className="bg-white shadow-sm relative z-40">
      <div className="px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-sky-500 flex-shrink-0">
          🏥 Jelfen
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`hover:text-sky-500 transition ${esActivo(link.to) ? 'text-sky-500 font-semibold' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Botones desktop */}
        <div className="hidden md:flex gap-3 items-center">
          <Link to="/registro" className="border border-sky-500 text-sky-500 px-4 py-2 rounded-full hover:bg-sky-50 font-medium text-sm">
            Soy Médico
          </Link>
          {usuario ? (
            <Link to="/dashboard" className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 font-medium text-sm">
              <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                {usuario.avatar}
              </div>
              {usuario.nombre.split(' ')[0]}
            </Link>
          ) : (
            <Link to="/login" className="bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 font-medium text-sm">
              Iniciar Sesión
            </Link>
          )}
        </div>

        {/* Botón hamburguesa mobile */}
        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuAbierto ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuAbierto ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuAbierto ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

      </div>

      {/* Menú mobile desplegable */}
      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-2 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuAbierto(false)}
              className={`py-3 px-4 rounded-xl font-medium transition ${
                esActivo(link.to)
                  ? 'bg-sky-50 text-sky-500'
                  : 'text-gray-600 hover:bg-sky-50 hover:text-sky-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-2">
            <Link
              to="/registro"
              onClick={() => setMenuAbierto(false)}
              className="py-3 px-4 rounded-xl border border-sky-500 text-sky-500 font-medium text-center hover:bg-sky-50"
            >
              Soy Médico
            </Link>
            {usuario ? (
              <Link
                to="/dashboard"
                onClick={() => setMenuAbierto(false)}
                className="py-3 px-4 rounded-xl bg-sky-500 text-white font-medium text-center hover:bg-sky-600"
              >
                Mi Cuenta — {usuario.nombre.split(' ')[0]}
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setMenuAbierto(false)}
                className="py-3 px-4 rounded-xl bg-sky-500 text-white font-medium text-center hover:bg-sky-600"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar