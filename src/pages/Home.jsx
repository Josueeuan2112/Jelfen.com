import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { doctores } from '../utils/doctores'
import { detectarEspecialidad } from '../utils/sintomas'
import ModalCita from '../components/ModalCita'
import BotonFavorito from '../components/BotonFavorito'


// ---PAGINA DE DOCTORES DESTACADOS--- 

function Hero() {
  const navigate = useNavigate()
  const [busqueda, setBusqueda] = useState('')
  const [sugerencia, setSugerencia] = useState(null)
  const [enfocado, setEnfocado] = useState(false)

  const handleInput = (e) => {
    const valor = e.target.value
    setBusqueda(valor)
    if (valor.length > 2) setSugerencia(detectarEspecialidad(valor))
    else setSugerencia(null)
  }

  const irAlEspecialista = (especialidad) => {
    navigate(`/buscar?especialidad=${encodeURIComponent(especialidad)}`)
  }

  const handleBuscar = () => {
    if (sugerencia) irAlEspecialista(sugerencia.especialidad)
    else if (busqueda.trim()) navigate('/buscar')
  }

  const chips = ['Me duele la cabeza', 'Tengo fiebre', 'Me duele la espalda', 'Ansiedad', 'Mi hijo está enfermo']

  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      <img src="/hero-doctors.png" alt="Médicos Jelfen" className="absolute inset-0 w-full h-full object-cover object-center" />

      {/* Overlay en mobile para legibilidad */}
      <div className="absolute inset-0 bg-white/70 md:bg-transparent" />

      <div className="relative z-10 w-full md:w-auto md:ml-auto md:mr-8 lg:mr-16 py-8 md:py-12 px-4 md:px-0 md:max-w-lg">
        <div className="bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-3xl md:rounded-none p-6 md:p-0 shadow-xl md:shadow-none">

          <span className="bg-sky-100 text-sky-600 text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase mb-4 inline-block">
            ✅ Médicos verificados ante la SEP
          </span>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 leading-tight">
            ¿Qué síntomas <br className="hidden md:block" />
            tienes hoy?
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-5">
            Describe lo que sientes y te decimos con qué especialista ir
          </p>

          {/* Buscador */}
          <div className="relative mb-4">
            <div className={`flex items-center bg-white rounded-xl shadow border-2 transition ${enfocado ? 'border-sky-400' : 'border-gray-200'}`}>
              <span className="pl-3 text-xl">🔍</span>
              <input
                type="text"
                value={busqueda}
                onChange={handleInput}
                onFocus={() => setEnfocado(true)}
                onBlur={() => setTimeout(() => setEnfocado(false), 150)}
                onKeyDown={(e) => e.key === 'Enter' && handleBuscar()}
                placeholder="Ej: me duele la cabeza..."
                className="flex-1 px-3 py-3 bg-transparent focus:outline-none text-gray-700 text-sm"
              />
              <button onClick={handleBuscar} className="m-1.5 bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-600 transition flex-shrink-0">
                Buscar
              </button>
            </div>

            {sugerencia && enfocado && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-sky-100 p-3 z-20">
                <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-semibold">Especialista recomendado</p>
                <button
                  onMouseDown={() => irAlEspecialista(sugerencia.especialidad)}
                  className="w-full flex items-center gap-3 bg-sky-50 hover:bg-sky-100 rounded-xl p-3 transition"
                >
                  <span className="text-3xl">{sugerencia.emoji}</span>
                  <div className="text-left flex-1">
                    <p className="font-bold text-gray-800 text-sm">{sugerencia.especialidad}</p>
                    <p className="text-gray-500 text-xs">{sugerencia.descripcion}</p>
                    <p className="text-sky-500 text-xs font-semibold mt-0.5">
                      Ver {doctores.filter(d => d.especialidad === sugerencia.especialidad).length} especialistas →
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Chips — scroll horizontal en mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {chips.map((chip, i) => (
              <button
                key={i}
                onClick={() => { setBusqueda(chip); setSugerencia(detectarEspecialidad(chip)) }}
                className="bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full text-xs hover:border-sky-400 hover:text-sky-600 transition shadow-sm flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

function DoctoresDestacados() {
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null)
  const doctoresOrdenados = [...doctores].sort((a, b) => b.calificacion - a.calificacion)

  return (
    <section className="py-10 md:py-16 px-4 md:px-6 bg-white">
      {doctorSeleccionado && <ModalCita doctor={doctorSeleccionado} onCerrar={() => setDoctorSeleccionado(null)} />}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Doctores Destacados</h2>
            <p className="text-gray-400 text-sm mt-1">Ordenados por calificación</p>
          </div>
          <Link to="/buscar" className="text-sky-500 hover:underline text-sm font-medium flex-shrink-0">Ver todos →</Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {doctoresOrdenados.map((doctor) => (
            <div key={doctor.id} className="min-w-56 md:min-w-64 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden snap-start flex-shrink-0">
              <div className="relative">
                <img src={doctor.imagen} alt={doctor.nombre} className="w-full h-40 md:h-44 object-cover object-top" />
                {doctor.verificado && <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">✅ SEP</span>}
                <div className="absolute top-2 left-2"><BotonFavorito doctorId={doctor.id} /></div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="font-bold text-gray-800 text-sm">{doctor.nombre}</h3>
                <p className="text-sky-500 text-xs mb-1">{doctor.especialidad}</p>
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="font-semibold text-gray-800 text-xs">{doctor.calificacion}</span>
                  <span className="text-gray-400 text-xs">· {doctor.resenas} reseñas</span>
                </div>
                <p className="text-gray-800 font-bold text-xs mb-3">desde ${doctor.precio} MXN</p>
                <div className="flex gap-2">
                  <Link to={`/doctor/${doctor.id}`} className="flex-1 border border-sky-500 text-sky-500 py-1.5 rounded-full text-xs text-center hover:bg-sky-50">Ver Perfil</Link>
                  <button onClick={() => setDoctorSeleccionado(doctor)} className="flex-1 bg-sky-500 text-white py-1.5 rounded-full text-xs hover:bg-sky-600">Reservar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center text-gray-400 text-xs mt-2">← Desliza para ver más →</p>
      </div>
    </section>
  )
}

function PorQueJelfen() {
  const razones = [
    { icono: '✅', titulo: 'Médicos Verificados', descripcion: 'Todos nuestros doctores pasan por verificación de cédula ante la SEP.' },
    { icono: '💻', titulo: 'Consulta donde quieras', descripcion: 'Videoconsultas y citas presenciales según lo que necesites.' },
    { icono: '⭐', titulo: 'Sistema de reseñas', descripcion: 'Lee opiniones reales de otros pacientes antes de elegir.' },
  ]
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 bg-sky-50">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8">¿Por qué elegir Jelfen?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {razones.map((razon, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 text-center shadow-sm">
            <div className="text-4xl mb-3">{razon.icono}</div>
            <h3 className="font-bold text-gray-800 mb-2">{razon.titulo}</h3>
            <p className="text-gray-500 text-sm">{razon.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ComoFunciona() {
  const pasos = [
    {
      numero: '01',
      icono: '🔍',
      titulo: 'Busca tu doctor',
      descripcion: 'Filtra por especialidad, modalidad y precio. Todos los médicos están verificados ante la SEP.',
    },
    {
      numero: '02',
      icono: '📅',
      titulo: 'Agenda tu cita',
      descripcion: 'Elige el día y horario que más te convenga. Presencial o videoconsulta desde cualquier lugar.',
    },
    {
      numero: '03',
      icono: '💳',
      titulo: 'Paga de forma segura',
      descripcion: 'Pago 100% seguro dentro de la plataforma. Sin efectivo, sin sorpresas.',
    },
    {
      numero: '04',
      icono: '✅',
      titulo: 'Recibe tu consulta',
      descripcion: 'Conéctate a tu videoconsulta o acude al consultorio. Tu salud, en buenas manos.',
    },
  ]

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">¿Cómo funciona Jelfen?</h2>
          <p className="text-gray-500">Agenda tu consulta en menos de 3 minutos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {pasos.map((paso, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">

              {/* Línea conectora entre pasos */}
              {index < pasos.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-sky-100 z-0" />
              )}

              {/* Círculo con número */}
              <div className="relative z-10 w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center text-2xl mb-4 shadow-md">
                {paso.icono}
              </div>

              <span className="text-xs font-bold text-sky-400 tracking-widest mb-1">PASO {paso.numero}</span>
              <h3 className="font-bold text-gray-800 mb-2">{paso.titulo}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{paso.descripcion}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/buscar" className="bg-sky-500 text-white px-10 py-3 rounded-full text-lg font-semibold hover:bg-sky-600 transition">
            Buscar Doctor Ahora
          </Link>
        </div>
      </div>
    </section>
  )
}

// --- DOCTOR DEL MES ---
function DoctorDelMes() {
  const doctor = doctores[0]

  return (
    <section className="py-12 px-6 bg-sky-50">
      <div className="max-w-5xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🏆</span>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Doctor del Mes</h2>
            <p className="text-sky-400 text-sm">El médico más valorado por los pacientes en abril 2026</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-center border border-white/40 shadow-lg">

          {/* Foto con corona */}
          <div className="relative shrink-0">
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl">👑</span>
            <img
              src={doctor.imagen}
              alt={doctor.nombre}
              className="w-28 h-28 rounded-2xl object-cover object-top border-4 border-yellow-400 shadow-lg"
            />
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">🏆 Doctor del Mes</span>
              <span className="bg-green-600/30 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">✅ Verificado SEP</span>
              <span className="bg-blue-400/30 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">🔵 Especialista</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{doctor.nombre}</h3>
            <p className="text-sky-400 mb-3">{doctor.especialidad} · {doctor.experiencia} años de experiencia</p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-gray-600 mb-4">
              <span>⭐ {doctor.calificacion} calificación</span>
              <span>💬 {doctor.resenas}+ reseñas</span>
              <span>📍 {doctor.ubicacion}</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed max-w-lg">{doctor.biografia}</p>
          </div>

           {/* CTA */}
          <div className="flex flex-col gap-3 shrink-0">
            <div className="bg-white/10 rounded-2xl p-4 text-center border border-white/20">
              <p className="text-sky-400 text-xs mb-1">Consulta desde</p>
              <p className="text-3xl font-bold text-gray-800">${doctor.precio}</p>
              <p className="text-sky-400 text-xs">MXN</p>
            </div>
            <Link
              to={`/doctor/${doctor.id}`}
              className="bg-gray-175 text-sky-600 px-6 py-3 rounded-xl font-semibold hover:bg-sky-50 transition text-center text-sm"
            >
              Ver Perfil Completo
            </Link>
          </div>

        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <div>
      <Hero />
      <DoctorDelMes />
      <DoctoresDestacados />
      <PorQueJelfen />
    </div>
  )
}

export default Home