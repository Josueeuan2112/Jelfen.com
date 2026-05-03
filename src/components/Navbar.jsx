import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/useAuth'

function Navbar() {
  const { usuario, notificaciones } = useAuth()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location = useLocation()

  const noLeidas = notificaciones?.filter(n => !n.leida).length || 0

  const links = [
    { to: '/', label: 'Principal' },
    { to: '/doctores', label: 'Doctores' },
    { to: '/contacto', label: 'Contáctanos' },
  ]

  const esActivo = (ruta) => location.pathname === ruta

  return (
    <nav className="bg-white shadow-sm relative z-40">
      <div className="px-6 py-4 flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold text-sky-500 flex-shrink-0">
          🏥 Jelfen
        </Link>

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

        <div className="hidden md:flex gap-3 items-center">
          <Link to="/registro" className="border border-sky-500 text-sky-500 px-4 py-2 rounded-full hover:bg-sky-50 font-medium text-sm">
            Soy Médico
          </Link>
          {usuario ? (
            <div className="flex items-center gap-2">
              {/* Campana de notificaciones */}
              <Link to="/dashboard" onClick={() => {}} className="relative w-10 h-10 bg-sky-50 rounded-full flex items-center justify-center hover:bg-sky-100 transition">
                <span className="text-lg">🔔</span>
                {noLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {noLeidas > 9 ? '9+' : noLeidas}
                  </span>
                )}
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 font-medium text-sm">
                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                  {usuario.avatar}
                </div>
                {usuario.nombre.split(' ')[0]}
              </Link>
            </div>
          ) : (
            <Link to="/login" className="bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 font-medium text-sm">
              Iniciar Sesión
            </Link>
          )}
        </div>

        <button
          onClick={() => setMenuAbierto(!menuAbierto)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuAbierto ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuAbierto ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-600 transition-all ${menuAbierto ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

      </div>

      {menuAbierto && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-2 shadow-lg">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuAbierto(false)}
              className={`py-3 px-4 rounded-xl font-medium transition ${
                esActivo(link.to) ? 'bg-sky-50 text-sky-500' : 'text-gray-600 hover:bg-sky-50 hover:text-sky-500'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 mt-1 flex flex-col gap-2">
            <Link to="/registro" onClick={() => setMenuAbierto(false)} className="py-3 px-4 rounded-xl border border-sky-500 text-sky-500 font-medium text-center hover:bg-sky-50">
              Soy Médico
            </Link>
            {usuario ? (
              <Link to="/dashboard" onClick={() => setMenuAbierto(false)} className="py-3 px-4 rounded-xl bg-sky-500 text-white font-medium text-center hover:bg-sky-600 flex items-center justify-center gap-2">
                Mi Cuenta — {usuario.nombre.split(' ')[0]}
                {noLeidas > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {noLeidas}
                  </span>
                )}
              </Link>
            ) : (
              <Link to="/login" onClick={() => setMenuAbierto(false)} className="py-3 px-4 rounded-xl bg-sky-500 text-white font-medium text-center hover:bg-sky-600">
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