import { useState } from 'react'
import { Link } from 'react-router-dom'
import { doctores } from '../utils/doctores'

// --- MODAL DE AGENDAR CITA ---
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

        {/* Header */}
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
                  {doctor.modalidad !== 'presencial' && (
                    <button
                      onClick={() => setTipo('videoconsulta')}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition ${tipo === 'videoconsulta' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600'}`}
                    >
                      💻 Videoconsulta
                    </button>
                  )}
                  {doctor.modalidad !== 'videoconsulta' && (
                    <button
                      onClick={() => setTipo('presencial')}
                      className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition ${tipo === 'presencial' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600'}`}
                    >
                      🏥 Presencial
                    </button>
                  )}
                  {doctor.modalidad === 'ambas' && (
                    <>
                      <button
                        onClick={() => setTipo('videoconsulta')}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition ${tipo === 'videoconsulta' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600'}`}
                      >
                        💻 Video
                      </button>
                      <button
                        onClick={() => setTipo('presencial')}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition ${tipo === 'presencial' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600'}`}
                      >
                        🏥 Presencial
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-gray-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Horario disponible</label>
                <div className="grid grid-cols-4 gap-2">
                  {horas.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHora(h)}
                      className={`py-2 rounded-lg text-sm border transition ${hora === h ? 'bg-sky-500 text-white border-sky-500' : 'border-gray-200 text-gray-600 hover:border-sky-300'}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-sky-50 rounded-xl p-4 flex justify-between items-center">
                <span className="text-gray-600 text-sm">Costo de consulta</span>
                <span className="font-bold text-gray-800 text-lg">${doctor.precio} MXN</span>
              </div>

              <button
                onClick={confirmar}
                disabled={!fecha || !hora || !tipo}
                className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar Cita
              </button>
            </div>
          )}

          {paso === 2 && (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">🎉</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">¡Cita agendada!</h3>
              <p className="text-gray-500 mb-4">Tu cita ha sido registrada exitosamente</p>
              <div className="bg-sky-50 rounded-xl p-4 text-left text-sm text-gray-600 mb-6 flex flex-col gap-2">
                <p><span className="font-semibold">Doctor:</span> {doctor.nombre}</p>
                <p><span className="font-semibold">Fecha:</span> {fecha}</p>
                <p><span className="font-semibold">Hora:</span> {hora}</p>
                <p><span className="font-semibold">Tipo:</span> {tipo}</p>
                <p><span className="font-semibold">Costo:</span> ${doctor.precio} MXN</p>
              </div>
              <p className="text-xs text-gray-400 mb-4">Recibirás una confirmación por correo electrónico</p>
              <button
                onClick={onCerrar}
                className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600"
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// --- FILTROS ---
function Filtros({ busqueda, setBusqueda, especialidad, setEspecialidad, modalidad, setModalidad }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="🔍 Buscar doctor por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="flex-1 border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-sky-400"
      />
      <select
        value={especialidad}
        onChange={(e) => setEspecialidad(e.target.value)}
        className="border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-sky-400 text-gray-600"
      >
        <option value="">Todas las especialidades</option>
        <option value="Pediatría">Pediatría</option>
        <option value="Cardiología">Cardiología</option>
        <option value="Medicina General">Medicina General</option>
        <option value="Dermatología">Dermatología</option>
      </select>
      <select
        value={modalidad}
        onChange={(e) => setModalidad(e.target.value)}
        className="border border-gray-200 rounded-full px-5 py-3 focus:outline-none focus:border-sky-400 text-gray-600"
      >
        <option value="">Cualquier modalidad</option>
        <option value="presencial">Presencial</option>
        <option value="videoconsulta">Videoconsulta</option>
        <option value="ambas">Ambas</option>
      </select>
    </div>
  )
}

// --- TARJETA DE DOCTOR ---
function TarjetaDoctor({ doctor, onAgendar }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden">
      <div className="relative">
        <img
          src={doctor.imagen}
          alt={doctor.nombre}
          className="w-full h-48 object-cover object-top"
        />
        {doctor.verificado && (
          <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            ✅ Verificado
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-lg">{doctor.nombre}</h3>
        <p className="text-sky-500 text-sm mb-2">{doctor.especialidad}</p>

        <div className="flex items-center gap-1 mb-3">
          <span className="text-yellow-400">★</span>
          <span className="font-semibold text-gray-800 text-sm">{doctor.calificacion}</span>
          <span className="text-gray-400 text-xs">· {doctor.resenas} reseñas</span>
          <span className="text-gray-300 mx-1">·</span>
          <span className="text-gray-400 text-xs capitalize">{doctor.modalidad}</span>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="font-bold text-gray-800">desde ${doctor.precio} MXN</span>
          <div className="flex gap-2">
            <Link
              to={`/doctor/${doctor.id}`}
              className="border border-sky-500 text-sky-500 px-3 py-2 rounded-full text-xs hover:bg-sky-50"
            >
              Ver Perfil
            </Link>
            <button
              onClick={() => onAgendar(doctor)}
              className="bg-sky-500 text-white px-3 py-2 rounded-full text-xs hover:bg-sky-600"
            >
              Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- PÁGINA COMPLETA ---
function DoctorSearch() {
  const [busqueda, setBusqueda] = useState('')
  const [especialidad, setEspecialidad] = useState('')
  const [modalidad, setModalidad] = useState('')
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null)

  const doctoresFiltrados = doctores
    .filter((doctor) => {
      const coincideNombre = doctor.nombre.toLowerCase().includes(busqueda.toLowerCase())
      const coincideEspecialidad = especialidad === '' || doctor.especialidad === especialidad
      const coincideModalidad = modalidad === '' || doctor.modalidad === modalidad
      return coincideNombre && coincideEspecialidad && coincideModalidad
    })
    .sort((a, b) => b.calificacion - a.calificacion)

  return (
    <div className="min-h-screen bg-sky-50 px-6 py-10">
      {doctorSeleccionado && (
        <ModalCita
          doctor={doctorSeleccionado}
          onCerrar={() => setDoctorSeleccionado(null)}
        />
      )}

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Encuentra tu Doctor</h1>
        <p className="text-gray-500 mb-8">Todos nuestros médicos están verificados ante la SEP ✅</p>

        <Filtros
          busqueda={busqueda} setBusqueda={setBusqueda}
          especialidad={especialidad} setEspecialidad={setEspecialidad}
          modalidad={modalidad} setModalidad={setModalidad}
        />

        <p className="text-gray-400 text-sm mb-4">{doctoresFiltrados.length} doctores encontrados</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctoresFiltrados.map((doctor) => (
            <TarjetaDoctor
              key={doctor.id}
              doctor={doctor}
              onAgendar={setDoctorSeleccionado}
            />
          ))}
        </div>

        {doctoresFiltrados.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-xl">No encontramos doctores con esos filtros</p>
            <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorSearch