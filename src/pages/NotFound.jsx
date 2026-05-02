import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function NotFound() {
  const navigate = useNavigate()
  const [contador, setContador] = useState(8)

  // Cuenta regresiva y redirige automáticamente
  useEffect(() => {
    const timer = setInterval(() => {
      setContador(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate('/')
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-6">
      <div className="text-center max-w-lg">

        {/* Número 404 */}
        <div className="relative mb-6">
          <p className="text-9xl font-bold text-sky-100 select-none">404</p>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🏥</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Página no encontrada
        </h1>
        <p className="text-gray-500 mb-2 leading-relaxed">
          Parece que esta página no existe o fue movida. No te preocupes — pasa hasta en los mejores hospitales.
        </p>
        <p className="text-sky-400 text-sm mb-8">
          Redirigiendo al inicio en <span className="font-bold text-sky-500">{contador}</span> segundos...
        </p>

        {/* Botones */}
        <div className="flex gap-4 justify-center flex-wrap mb-10">
          <Link
            to="/"
            className="bg-sky-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-sky-600 transition shadow-md"
          >
            Ir al inicio
          </Link>
          <Link
            to="/doctores"
            className="border-2 border-sky-500 text-sky-500 px-8 py-3 rounded-full font-semibold hover:bg-sky-50 transition"
          >
            Buscar Doctor
          </Link>
        </div>

        {/* Links útiles */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <p className="text-gray-500 text-sm font-medium mb-4">¿A dónde querías ir?</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { to: '/', icono: '🏠', label: 'Principal' },
              { to: '/doctores', icono: '👨‍⚕️', label: 'Doctores' },
              { to: '/nosotros', icono: 'ℹ️', label: 'Nosotros' },
              { to: '/contacto', icono: '📧', label: 'Contacto' },
              { to: '/registro', icono: '📋', label: 'Soy Médico' },
              { to: '/login', icono: '🔐', label: 'Iniciar Sesión' },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.to}
                className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium transition"
              >
                <span>{link.icono}</span>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default NotFound