import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [modo, setModo] = useState('login') // 'login' | 'registro'
  const [form, setForm] = useState({
    nombre: '', correo: '', contrasena: '', telefono: ''
  })
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.correo || !form.contrasena) {
      setError('Por favor completa todos los campos')
      return
    }

    if (modo === 'registro' && !form.nombre) {
      setError('El nombre es obligatorio')
      return
    }

    // Simulamos login exitoso
    login({
      nombre: form.nombre || form.correo.split('@')[0],
      correo: form.correo,
      telefono: form.telefono || '(999) 000-0000',
      avatar: form.nombre ? form.nombre[0].toUpperCase() : '?',
      citas: [
        { id: 1, doctor: 'Dra. Elena Gómez', especialidad: 'Pediatría', fecha: '2025-05-15', hora: '10:30 AM', tipo: 'Presencial', estado: 'confirmada' },
        { id: 2, doctor: 'Dr. Javier Ruiz', especialidad: 'Cardiología', fecha: '2025-05-21', hora: '11:00 AM', tipo: 'Videoconsulta', estado: 'confirmada' },
        { id: 3, doctor: 'Dra. Sofía Morales', especialidad: 'Medicina General', fecha: '2025-05-27', hora: '09:00 AM', tipo: 'Videoconsulta', estado: 'pendiente' },
      ]
    })

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-sky-500">🏥 Jelfen</Link>
          <p className="text-gray-500 mt-2">Tu salud en buenas manos</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-8">

          {/* Tabs */}
          <div className="flex bg-sky-50 rounded-xl p-1 mb-6">
            <button
              onClick={() => setModo('login')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${modo === 'login' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setModo('registro')}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${modo === 'registro' ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Crear Cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {modo === 'registro' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-sm"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Correo electrónico</label>
              <input
                type="email"
                name="correo"
                value={form.correo}
                onChange={handleChange}
                placeholder="tucorreo@ejemplo.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-sm"
              />
            </div>

            {modo === 'registro' && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="(999) 000-0000"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-sm"
                />
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Contraseña</label>
              <input
                type="password"
                name="contrasena"
                value={form.contrasena}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-sm"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-xl">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition mt-2"
            >
              {modo === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </button>

          </form>

          {modo === 'login' && (
            <p className="text-center text-gray-400 text-xs mt-4">
              ¿No tienes cuenta?{' '}
              <button onClick={() => setModo('registro')} className="text-sky-500 hover:underline font-medium">
                Regístrate gratis
              </button>
            </p>
          )}

        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          <Link to="/" className="hover:text-sky-500">← Volver al inicio</Link>
        </p>

      </div>
    </div>
  )
}

export default Login