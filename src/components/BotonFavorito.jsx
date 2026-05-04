import { useAuth } from '../context/useAuth'
import { useNavigate } from 'react-router-dom'

function BotonFavorito({ doctorId, className = '' }) {
  const { usuario, esFavorito, toggleFavorito } = useAuth()
  const navigate = useNavigate()
  const activo = esFavorito(doctorId)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!usuario) {
      navigate('/login')
      return
    }

    toggleFavorito(doctorId)
  }

  return (
    <button
      onClick={handleClick}
      title={activo ? 'Quitar de favoritos' : 'Guardar en favoritos'}
      className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
        activo
          ? 'bg-red-100 text-red-500 hover:bg-red-200'
          : 'bg-white/80 backdrop-blur-sm text-gray-400 hover:text-red-400 hover:bg-red-50'
      } ${className}`}
    >
      <span className="text-lg leading-none">{activo ? '❤️' : '🤍'}</span>
    </button>
  )
}

export default BotonFavorito