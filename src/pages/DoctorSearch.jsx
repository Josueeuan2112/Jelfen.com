import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { doctores } from '../utils/doctores'
import ModalCita from '../components/ModalCita'

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
        <option value="Neurología">Neurología</option>
        <option value="Traumatología">Traumatología</option>
        <option value="Oftalmología">Oftalmología</option>
        <option value="Odontología">Odontología</option>
        <option value="Psicología">Psicología</option>
|     </select>
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
  const [searchParams] = useSearchParams()
  const [busqueda, setBusqueda] = useState('')
  const [especialidad, setEspecialidad] = useState(searchParams.get('especialidad') || '')
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