import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { doctores } from '../utils/doctores'

function ModalCita({ doctor, onCerrar }) {
  const [paso, setPaso] = useState(1)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [tipo, setTipo] = useState('')

  const horas = ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00']

  const confirmar = () => {
    if (!fecha || !hora || !tipo) return
    setPaso(2)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="bg-sky-500 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <div>
            <p className="font-bold">Reservar Cita</p>
            <p className="text-sky-100 text-sm">{doctor.nombre}</p>
          </div>
          <button onClick={onCerrar} className="text-white text-xl hover:text-sky-200">✕</button>
        </div>
        <div className="p-6">
          {paso === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de consulta</label>
                <div className="flex gap-3">
                  {(doctor.modalidad === 'videoconsulta' || doctor.modalidad === 'ambas') && (
                    <button onClick={() => setTipo('videoconsulta')} className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition ${tipo === 'videoconsulta' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600'}`}>
                      💻 Videoconsulta
                    </button>
                  )}
                  {(doctor.modalidad === 'presencial' || doctor.modalidad === 'ambas') && (
                    <button onClick={() => setTipo('presencial')} className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition ${tipo === 'presencial' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600'}`}>
                      🏥 Presencial
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha</label>
                <input type="date" value={fecha} min={new Date().toISOString().split('T')[0]} onChange={(e) => setFecha(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-gray-600" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Horario disponible</label>
                <div className="grid grid-cols-4 gap-2">
                  {horas.map((h) => (
                    <button key={h} onClick={() => setHora(h)} className={`py-2 rounded-lg text-sm border transition ${hora === h ? 'bg-sky-500 text-white border-sky-500' : 'border-gray-200 text-gray-600 hover:border-sky-300'}`}>{h}</button>
                  ))}
                </div>
              </div>
              <div className="bg-sky-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-gray-600 text-sm">Costo de consulta</span>
                <span className="font-bold text-gray-800 text-lg">${doctor.precio} MXN</span>
              </div>
              <button onClick={confirmar} disabled={!fecha || !hora || !tipo} className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-40 disabled:cursor-not-allowed">
                Confirmar Cita
              </button>
            </div>
          )}
          {paso === 2 && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">¡Cita agendada!</h3>
              <div className="bg-sky-50 rounded-xl p-4 text-left text-sm text-gray-600 mb-6 flex flex-col gap-2">
                <p><span className="font-semibold">Doctor:</span> {doctor.nombre}</p>
                <p><span className="font-semibold">Fecha:</span> {fecha}</p>
                <p><span className="font-semibold">Hora:</span> {hora}</p>
                <p><span className="font-semibold">Tipo:</span> {tipo}</p>
                <p><span className="font-semibold">Costo:</span> ${doctor.precio} MXN</p>
              </div>
              <button onClick={onCerrar} className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600">Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
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
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row gap-6 items-start">

      {/* Foto */}
      <div className="w-28 h-28 bg-sky-100 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0">
        👨‍⚕️
      </div>

      {/* Info principal */}
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

        <div className="flex items-center gap-2 mb-3">
          <Estrellas calificacion={doctor.calificacion} />
          <span className="font-bold text-gray-800">{doctor.calificacion}</span>
          <span className="text-gray-400 text-sm">· {doctor.resenas} reseñas</span>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>📍 {doctor.ubicacion}</span>
          <span>🕐 {doctor.experiencia} años de experiencia</span>
          <span>🌐 {doctor.idiomas.join(', ')}</span>
          <span className="capitalize">📋 {doctor.modalidad}</span>
        </div>
      </div>

      {/* Precio y botón */}
      <div className="bg-sky-50 rounded-2xl p-6 text-center min-w-48">
        <p className="text-gray-500 text-sm mb-1">Consulta desde</p>
        <p className="text-3xl font-bold text-gray-800">${doctor.precio}</p>
        <p className="text-gray-400 text-xs mb-4">MXN</p>
        <button 
        onClick={onAgendar}
        className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition">
          Reservar Cita
        </button>
        <p className="text-xs text-gray-400 mt-2">⏱ Responde en menos de 1 hr</p>
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
function Resenas({ reviews, calificacion, total }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Reseñas de pacientes</h2>
        <div className="flex items-center gap-2">
          <Estrellas calificacion={calificacion} />
          <span className="font-bold text-gray-800">{calificacion}</span>
          <span className="text-gray-400 text-sm">({total})</span>
        </div>
      </div>

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
            <Estrellas calificacion={review.calificacion} />
            <p className="text-gray-600 text-sm mt-1">{review.comentario}</p>
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
        <Resenas reviews={doctor.reviews} calificacion={doctor.calificacion} total={doctor.resenas} />
      </div>
    </div>
  )
}

export default DoctorProfile