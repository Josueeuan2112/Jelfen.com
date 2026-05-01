import { Link } from 'react-router-dom'
import { useState } from 'react'
import { doctores } from '../utils/doctores'



// ---PAGINA DE DOCTORES DESTACADOS--- 

function ModalCita({ doctor, onCerrar }) {
  const [paso, setPaso] = useState(1)
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [tipo, setTipo] = useState('')
  const horas = ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00']
  const confirmar = () => { if (!fecha || !hora || !tipo) return; setPaso(2) }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="bg-sky-500 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <div><p className="font-bold">Reservar Cita</p><p className="text-sky-100 text-sm">{doctor.nombre}</p></div>
          <button onClick={onCerrar} className="text-white text-xl">✕</button>
        </div>
        <div className="p-6">
          {paso === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de consulta</label>
                <div className="flex gap-3">
                  {(doctor.modalidad === 'videoconsulta' || doctor.modalidad === 'ambas') && (
                    <button onClick={() => setTipo('videoconsulta')} className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition ${tipo === 'videoconsulta' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600'}`}>💻 Videoconsulta</button>
                  )}
                  {(doctor.modalidad === 'presencial' || doctor.modalidad === 'ambas') && (
                    <button onClick={() => setTipo('presencial')} className={`flex-1 py-3 rounded-xl border-2 text-sm font-medium transition ${tipo === 'presencial' ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-gray-200 text-gray-600'}`}>🏥 Presencial</button>
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
              <button onClick={confirmar} disabled={!fecha || !hora || !tipo} className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-40 disabled:cursor-not-allowed">Confirmar Cita</button>
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

function Hero() {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden">

      {/* Imagen ocupa todo el hero */}
      <img
        src="/hero-doctors.png"
        alt="Médicos Jelfen"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Texto encima — pegado a la derecha */}
      <div className="relative z-10 ml-auto mr-10 md:mr-20 py-24 max-w-lg text-right">
        <span className="bg-white/80 text-sky-600 text-xs font-bold px-4 py-2 rounded-full tracking-widest uppercase mb-6 inline-block backdrop-blur-sm">
          ✅ Médicos verificados ante la SEP
        </span>
        <h1 className="text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Consultas Médicas <br />
          en Línea con los <br />
          <span className="text-sky-500">Mejores Doctores</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
          Tu salud en buenas manos, estés donde estés. Agenda en minutos, sin filas ni esperas.
        </p>
        <div className="flex gap-4 flex-wrap justify-end">
          <Link to="/buscar" className="bg-sky-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-sky-600 shadow-md transition">
            Encontrar un Doctor
          </Link>
          <Link to="/registro" className="border-2 border-sky-500 text-sky-500 bg-white/80 backdrop-blur-sm px-8 py-3 rounded-full text-lg font-semibold hover:bg-white transition">
            Soy Médico
          </Link>
        </div>
      </div>

    </section>
  )
}

function DoctoresDestacados() {
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null)

  const doctoresOrdenados = [...doctores].sort((a, b) => b.calificacion - a.calificacion)

  return (
    <section className="py-16 px-6 bg-sky-50">
      {doctorSeleccionado && (
        <ModalCita doctor={doctorSeleccionado} onCerrar={() => setDoctorSeleccionado(null)} />
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Los Mejores Especialistas</h2>
          <Link to="/buscar" className="text-sky-500 hover:underline text-sm font-medium">
            Ver todos →
          </Link>
        </div>

        {/* Scroll horizontal */}
        <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
          {doctoresOrdenados.map((doctor) => (
            <div
              key={doctor.id}
              className="min-w-64 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden snap-start flex-shrink-0"
            >
              <div className="relative">
                <img
                  src={doctor.imagen}
                  alt={doctor.nombre}
                  className="w-full h-44 object-cover object-top"
                />
                {doctor.verificado && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    ✅ SEP
                  </span>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-800">{doctor.nombre}</h3>
                <p className="text-sky-500 text-sm mb-1">{doctor.especialidad}</p>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="font-semibold text-gray-800 text-sm">{doctor.calificacion}</span>
                  <span className="text-gray-400 text-xs">· {doctor.resenas} reseñas</span>
                </div>
                <p className="text-gray-800 font-bold text-sm mb-3">desde ${doctor.precio} MXN</p>
                <div className="flex gap-2">
                  <Link
                    to={`/doctor/${doctor.id}`}
                    className="flex-1 border border-sky-500 text-sky-500 py-2 rounded-full text-xs text-center hover:bg-sky-50"
                  >
                    Ver Perfil
                  </Link>
                  <button
                    onClick={() => setDoctorSeleccionado(doctor)}
                    className="flex-1 bg-sky-500 text-white py-2 rounded-full text-xs hover:bg-sky-600"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Indicador de scroll */}
        <p className="text-center text-gray-400 text-xs mt-3">← Desliza para ver más doctores →</p>
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
    <section className="py-16 px-6 bg-sky-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">¿Por qué elegir Jelfen?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {razones.map((razon, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 text-center shadow-sm">
            <div className="text-4xl mb-4">{razon.icono}</div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">{razon.titulo}</h3>
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
          <div className="relative flex-shrink-0">
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
          <div className="flex flex-col gap-3 flex-shrink-0">
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