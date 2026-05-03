import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { doctores } from '../utils/doctores'
import ModalCita from '../components/ModalCita'
import { useAuth } from '../context/useAuth'

function obtenerFechas() {
  const hoy = new Date()
  const manana = new Date(hoy)
  manana.setDate(hoy.getDate() + 1)
  const pasado = new Date(hoy)
  pasado.setDate(hoy.getDate() + 2)

  const formatear = (fecha) => fecha.toLocaleDateString('es-MX', {
    weekday: 'short', day: 'numeric', month: 'short'
  })

  return [
    { label: 'Hoy', fecha: formatear(hoy), key: 'hoy' },
    { label: 'Mañana', fecha: formatear(manana), key: 'manana' },
    { label: formatear(pasado), fecha: formatear(pasado), key: 'pasado' },
  ]
}

// --- ESTRELLAS ---
function Estrellas({ calificacion }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((estrella) => (
        <span
          key={estrella}
          className={estrella <= Math.round(calificacion) ? 'text-yellow-400' : 'text-gray-200'}
        >
          ★
        </span>
      ))}
    </div>
  )
}

// --- HEADER DEL MÉDICO ---
function HeaderDoctor({ doctor, onAgendar }) {
  const [diaSeleccionado, setDiaSeleccionado] = useState('hoy')
  const fechas = obtenerFechas()
  const horasDisponibles = doctor.disponibilidad?.[diaSeleccionado] || []
  const proximaHoy = doctor.disponibilidad?.hoy?.[0]

  return (
    <div className="bg-sky-50 rounded-2xl shadow-sm overflow-hidden border border-sky-100">

      {/* Banner superior */}
      <div className="p-6 flex flex-col md:flex-row gap-6 items-start">

        <img
          src={doctor.imagen}
          alt={doctor.nombre}
          className="w-28 h-28 rounded-2xl object-cover object-top border-4 border-sky-200 shadow-md flex-shrink-0"
        />

        <div className="flex-1">
          <div className="flex flex-wrap gap-2 mb-2">
            {doctor.verificado && (
              <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                ✅ Médico Verificado SEP
              </span>
            )}
            {doctor.especialistaVerificado && (
              <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                🔵 Especialista Verificado
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{doctor.nombre}</h1>
          <p className="text-sky-500 font-medium mb-2">{doctor.especialidad}</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span>📍 {doctor.ubicacion}</span>
            <span>🕐 {doctor.experiencia} años de experiencia</span>
            <span>🌐 {doctor.idiomas.join(', ')}</span>
          </div>
        </div>

        {/* Precio — glassmorphism sobre sky-50 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 text-center border border-sky-200 shadow-sm flex-shrink-0">
          <p className="text-gray-400 text-xs mb-1">Consulta desde</p>
          <p className="text-4xl font-bold text-sky-500">${doctor.precio}</p>
          <p className="text-gray-400 text-xs mb-2">MXN</p>
          {proximaHoy && (
            <p className="text-green-500 text-xs font-semibold">
              🟢 Hoy a las {proximaHoy}
            </p>
          )}
          {!proximaHoy && (
            <p className="text-red-400 text-xs font-semibold">
              🔴 Sin espacio hoy
            </p>
          )}
        </div>

      </div>

      {/* Calificación */}
      <div className="px-6 py-3 bg-sky-50 backdrop-blur-sm flex items-center gap-3 border-t border-sky-100">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(e => (
            <span key={e} className={e <= Math.round(doctor.calificacion) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
          ))}
        </div>
        <span className="font-bold text-gray-800">{doctor.calificacion}</span>
        <span className="text-gray-400 text-sm">· {doctor.resenas} reseñas</span>
        <span className="text-gray-300 mx-1">·</span>
        <span className="text-gray-500 text-sm capitalize">📋 {doctor.modalidad}</span>
      </div>

      {/* Disponibilidad */}
      <div className="p-6,">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">📅 Disponibilidad</h3>
          <span className="text-xs text-gray-400">Horarios en tiempo real</span>
        </div>

        {/* Tabs de días */}
        <div className="flex gap-2 mb-4">
          {fechas.map((dia) => {
            const horas = doctor.disponibilidad?.[dia.key] || []
            return (
              <button
                key={dia.key}
                onClick={() => setDiaSeleccionado(dia.key)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border-2 transition ${
                  diaSeleccionado === dia.key
                    ? 'border-sky-500 bg-white text-sky-700 shadow-sm'
                    : 'border-sky-100 bg-white/50 text-gray-500 hover:border-sky-300'
                }`}
              >
                <p>{dia.label}</p>
                <p className={`text-xs mt-0.5 font-normal ${horas.length > 0 ? 'text-green-500' : 'text-red-400'}`}>
                  {horas.length > 0 ? `${horas.length} horarios` : 'Sin espacios'}
                </p>
              </button>
            )
          })}
        </div>

        {/* Horarios */}
        {horasDisponibles.length > 0 ? (
          <>
            <div className="grid grid-cols-4 gap-2 mb-4">
              {horasDisponibles.map((hora) => (
                <button
                  key={hora}
                  onClick={onAgendar}
                  className="py-2 bg-white border border-sky-200 text-sky-700 rounded-xl text-xs font-semibold hover:bg-sky-500 hover:text-white hover:border-sky-500 transition shadow-sm"
                >
                  {hora}
                </button>
              ))}
            </div>
            <button
              onClick={onAgendar}
              className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition shadow-sm"
            >
              Reservar Cita
            </button>
          </>
        ) : (
          <div className="text-center py-6 bg-white/60 rounded-xl border border-sky-100">
            <p className="text-gray-400 text-sm">Sin horarios disponibles este día</p>
            <p className="text-sky-500 text-xs mt-1 font-medium">Prueba con otro día →</p>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-3">⏱ Responde en menos de 1 hora</p>
      </div>

    </div>
  )
}

// --- SOBRE EL MÉDICO ---
function SobreElMedico({ doctor }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-3">Sobre el médico</h2>
      <p className="text-gray-600 leading-relaxed mb-4">{doctor.biografia}</p>
      <div>
        <p className="font-semibold text-gray-700 mb-2">Horarios de atención:</p>
        <p className="text-gray-500 text-sm">🕐 {doctor.horarios}</p>
      </div>
    </div>
  )
}

// --- SERVICIOS ---
function Servicios({ servicios }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Servicios</h2>
      <div className="flex flex-wrap gap-2">
        {servicios.map((servicio, i) => (
          <span key={i} className="bg-sky-50 text-sky-700 px-4 py-2 rounded-full text-sm font-medium">
            {servicio}
          </span>
        ))}
      </div>
    </div>
  )
}

// --- RESEÑAS ---
function Resenas({ reviews, calificacion, total, doctorId }) {
  const { resenas } = useAuth()
  const resenasNuevas = resenas?.[doctorId] || []
  const todasLasResenas = [...resenasNuevas, ...reviews]

  const promedioReal = todasLasResenas.length > 0
    ? (todasLasResenas.reduce((sum, r) => sum + r.calificacion, 0) / todasLasResenas.length).toFixed(1)
    : calificacion

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">

      {/* Header con promedio */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Reseñas de pacientes</h2>
        <div className="flex items-center gap-2 bg-sky-50 px-4 py-2 rounded-xl border border-sky-100">
          <div className="flex gap-0.5">
            {[1,2,3,4,5].map(e => (
              <span key={e} className={e <= Math.round(promedioReal) ? 'text-yellow-400' : 'text-gray-200'}>★</span>
            ))}
          </div>
          <span className="font-bold text-gray-800">{promedioReal}</span>
          <span className="text-gray-400 text-sm">({todasLasResenas.length})</span>
        </div>
      </div>

      {/* Reseñas verificadas nuevas */}
      {resenasNuevas.length > 0 && (
        <div className="mb-5">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-3 flex items-center gap-1">
            <span>✅</span> Reseñas verificadas recientes
          </p>
          <div className="flex flex-col gap-3 mb-4">
            {resenasNuevas.map((review) => (
              <div key={review.id} className="bg-green-50 border border-green-100 rounded-2xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {review.autor[0]}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">{review.autor}</span>
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        ✅ Paciente verificado
                      </span>
                    </div>
                  </div>
                  <span className="text-gray-400 text-xs">{review.fecha}</span>
                </div>
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map(e => (
                    <span key={e} className={`text-sm ${e <= review.calificacion ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm">{review.comentario}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 mb-4" />
        </div>
      )}

      {/* Reseñas originales */}
      <div className="flex flex-col gap-4">
        {reviews.map((review, i) => (
          <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center text-sm font-bold text-sky-600">
                  {review.autor[0]}
                </div>
                <span className="font-semibold text-gray-800 text-sm">{review.autor}</span>
              </div>
              <span className="text-gray-400 text-xs">{review.fecha}</span>
            </div>
            <div className="flex gap-0.5 mb-1">
              {[1,2,3,4,5].map(e => (
                <span key={e} className={`text-sm ${e <= review.calificacion ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
            <p className="text-gray-600 text-sm">{review.comentario}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

// --- PÁGINA COMPLETA ---
function DoctorProfile() {
  const { id } = useParams()
  const [modalAbierto, setModalAbierto] = useState(false)
  const doctor = doctores.find((d) => d.id === parseInt(id))

  if (!doctor) {
    return (
      <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">🔍</p>
        <h2 className="text-2xl font-bold text-gray-800">Médico no encontrado</h2>
        <Link to="/buscar" className="text-sky-500 hover:underline">Volver al buscador</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sky-50 px-6 py-10">
      {modalAbierto && <ModalCita doctor={doctor} onCerrar={() => setModalAbierto(false)} />}
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <Link to="/buscar" className="text-sky-500 hover:underline text-sm">← Volver al buscador</Link>
        <HeaderDoctor doctor={doctor} onAgendar={() => setModalAbierto(true)} />
        <SobreElMedico doctor={doctor} />
        <Servicios servicios={doctor.servicios} />
        <Resenas reviews={doctor.reviews} calificacion={doctor.calificacion} total={doctor.resenas} doctorId={doctor.id} />
      </div>
    </div>
  )
}

export default DoctorProfile