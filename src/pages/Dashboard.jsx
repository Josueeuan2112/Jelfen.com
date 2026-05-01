import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// --- SIDEBAR ---
function Sidebar({ seccion, setSeccion, usuario, onLogout }) {
  const items = [
    { id: 'perfil', icono: '👤', label: 'Mi Perfil' },
    { id: 'citas', icono: '📅', label: 'Citas' },
    { id: 'datos', icono: '📋', label: 'Mis Datos' },
    { id: 'pagos', icono: '💳', label: 'Pagos' },
    { id: 'historial', icono: '🕐', label: 'Historial' },
    { id: 'notificaciones', icono: '🔔', label: 'Notificaciones' },
  ]

  return (
    <div className="w-60 bg-sky-50 border-r border-gray-100 flex flex-col min-h-screen">

     

      {/* Nav */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSeccion(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition text-left w-full ${
              seccion === item.id
                ? 'bg-sky-500 text-white shadow-md'
                : 'text-gray-500 hover:bg-sky-50 hover:text-sky-600'
            }`}
          >
            <span>{item.icono}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition w-full"
        >
          <span>🚪</span>
          Cerrar Sesión
        </button>
      </div>

    </div>
  )
}

// --- CALENDARIO ---
function Calendario() {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [anio, setAnio] = useState(hoy.getFullYear())

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const dias = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']

  const primerDia = new Date(anio, mes, 1).getDay()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()
  const offset = primerDia === 0 ? 6 : primerDia - 1

  const diasConCita = [5, 15, 21, 27]

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => { if(mes === 0) { setMes(11); setAnio(a => a-1) } else setMes(m => m-1) }} className="text-gray-400 hover:text-sky-500 text-lg">‹</button>
        <p className="font-bold text-gray-800 text-sm">{meses[mes]} {anio}</p>
        <button onClick={() => { if(mes === 11) { setMes(0); setAnio(a => a+1) } else setMes(m => m+1) }} className="text-gray-400 hover:text-sky-500 text-lg">›</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dias.map(d => <p key={d} className="text-xs text-gray-400 text-center font-medium">{d}</p>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(offset).fill(null).map((_, i) => <div key={`e-${i}`} />)}
        {Array(diasEnMes).fill(null).map((_, i) => {
          const dia = i + 1
          const esHoy = dia === hoy.getDate() && mes === hoy.getMonth() && anio === hoy.getFullYear()
          const tieneCita = diasConCita.includes(dia)
          return (
            <div key={dia} className={`aspect-square flex items-center justify-center rounded-full text-xs font-medium cursor-pointer transition
              ${esHoy ? 'bg-sky-500 text-white' : tieneCita ? 'bg-sky-100 text-sky-600 font-bold' : 'text-gray-600 hover:bg-sky-50'}`}>
              {dia}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// --- SECCIÓN CITAS ---
function SeccionCitas({ usuario, navigate }) {
  const estados = {
    confirmada: 'bg-green-100 text-green-700',
    pendiente: 'bg-yellow-100 text-yellow-700',
    cancelada: 'bg-red-100 text-red-700',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Próximas Citas</h2>
        <button
          onClick={() => navigate('/doctores')}
          className="bg-sky-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-sky-600 transition flex items-center gap-2"
        >
          + Agendar Nueva Cita
        </button>
      </div>

      {usuario.citas.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-4xl mb-4">📅</p>
          <p className="text-gray-500">No tienes citas programadas</p>
          <button onClick={() => navigate('/doctores')} className="mt-4 text-sky-500 hover:underline text-sm">Buscar un doctor</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {usuario.citas.map((cita) => (
            <div key={cita.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition flex items-center gap-5">

              {/* Fecha */}
              <div className="bg-sky-500 text-white rounded-xl p-3 text-center min-w-16 flex-shrink-0">
                <p className="text-xl font-bold leading-none">{new Date(cita.fecha).getDate()}</p>
                <p className="text-xs text-sky-200">{new Date(cita.fecha).toLocaleString('es-MX', { month: 'short' })}</p>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-bold text-gray-800">{cita.doctor}</p>
                <p className="text-sky-500 text-sm">{cita.especialidad}</p>
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  <span>🕐 {cita.hora}</span>
                  <span>📋 {cita.tipo}</span>
                </div>
              </div>

              {/* Estado */}
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${estados[cita.estado]}`}>
                {cita.estado}
              </span>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// --- SECCIÓN PERFIL ---
function SeccionPerfil({ usuario }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800">Mi Perfil</h2>
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">

        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-8 border-b border-gray-100">
          <div className="w-20 h-20 bg-sky-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {usuario.avatar}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{usuario.nombre}</h3>
            <p className="text-sky-500">{usuario.correo}</p>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mt-1 inline-block">
              ✅ Paciente verificado
            </span>
          </div>
        </div>

        {/* Datos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { icono: '👤', label: 'Nombre completo', valor: usuario.nombre },
            { icono: '📧', label: 'Correo electrónico', valor: usuario.correo },
            { icono: '📱', label: 'Teléfono', valor: usuario.telefono },
            { icono: '📍', label: 'Ubicación', valor: 'Mérida, Yucatán' },
          ].map((dato, i) => (
            <div key={i} className="bg-sky-50 rounded-xl p-4">
              <p className="text-xs text-gray-400 mb-1">{dato.icono} {dato.label}</p>
              <p className="font-semibold text-gray-800">{dato.valor}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

// --- SECCIÓN PLACEHOLDER ---
function SeccionProximamente({ titulo, icono }) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-800">{titulo}</h2>
      <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
        <p className="text-5xl mb-4">{icono}</p>
        <p className="text-gray-500 font-medium">Próximamente</p>
        <p className="text-gray-400 text-sm mt-1">Esta sección estará disponible muy pronto</p>
      </div>
    </div>
  )
}

// --- PÁGINA COMPLETA ---
function Dashboard() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [seccion, setSeccion] = useState('citas')

  if (!usuario) {
    navigate('/login')
    return null
  }

  const onLogout = () => {
    logout()
    navigate('/')
  }

  const renderSeccion = () => {
    switch(seccion) {
      case 'citas': return <SeccionCitas usuario={usuario} navigate={navigate} />
      case 'perfil': return <SeccionPerfil usuario={usuario} />
      case 'datos': return <SeccionProximamente titulo="Mis Datos" icono="📋" />
      case 'pagos': return <SeccionProximamente titulo="Pagos" icono="💳" />
      case 'historial': return <SeccionProximamente titulo="Historial" icono="🕐" />
      case 'notificaciones': return <SeccionProximamente titulo="Notificaciones" icono="🔔" />
      default: return null
    }
  }

  return (
    <div className="flex min-h-screen bg-sky-50">

      <Sidebar seccion={seccion} setSeccion={setSeccion} usuario={usuario} onLogout={onLogout} />

      <div className="flex-1 flex flex-col">

        {/* Header */}
        <div className="bg-sky-50 border-b border-gray-100 px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">— Mi Cuenta</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {usuario.avatar}
            </div>
            <p className="font-semibold text-gray-700 text-sm">{usuario.nombre}</p>
            <button onClick={onLogout} className="text-gray-400 hover:text-red-400 transition text-xl" title="Cerrar sesión">→</button>
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 flex gap-6 p-8">

          {/* Main */}
          <div className="flex-1">
            {renderSeccion()}
          </div>

          {/* Panel derecho */}
          <div className="w-72 flex flex-col gap-5 flex-shrink-0">

            <Calendario />

            {/* Mensajes recientes */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">💬 Mensajes Recientes</h3>
              <div className="flex flex-col gap-3">
                {[
                  { de: 'Jelfen', msg: 'Tu cita del 15 de mayo ha sido confirmada exitosamente.' },
                  { de: 'Dra. Elena Gómez', msg: 'Recuerda traer tus estudios previos a la consulta.' },
                ].map((m, i) => (
                  <div key={i} className="bg-sky-50 rounded-xl p-3">
                    <p className="text-xs font-bold text-sky-600 mb-1">{m.de}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{m.msg}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recomendaciones */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-3">⭐ Recomendaciones</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Basado en tu historial, te recomendamos una revisión general cada 6 meses.
              </p>
              <button
                onClick={() => navigate('/doctores')}
                className="w-full bg-sky-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-sky-600 transition"
              >
                Ver Doctores Disponibles
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard