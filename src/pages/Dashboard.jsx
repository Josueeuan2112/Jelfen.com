import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// --- SIDEBAR ---
function Sidebar({ seccion, setSeccion, onLogout }) {
  const items = [
    { id: 'citas', icono: '📅', label: 'Citas' },
    { id: 'perfil', icono: '👤', label: 'Perfil' },
    { id: 'datos', icono: '📋', label: 'Datos' },
    { id: 'pagos', icono: '💳', label: 'Pagos' },
    { id: 'historial', icono: '🕐', label: 'Historial' },
    { id: 'notificaciones', icono: '🔔', label: 'Avisos' },
  ]

  return (
    <>
      {/* Sidebar desktop */}
      <div className="hidden md:flex w-60 bg-sky.50 border-r border-gray-100 flex-col min-h-screen">
        <div className="p-6 border-b border-gray-100">
        </div>
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
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-50 w-full"
          >
            <span>🚪</span>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Barra inferior mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 flex justify-around px-2 py-2 shadow-lg">
        {items.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setSeccion(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition ${
              seccion === item.id ? 'text-sky-500' : 'text-gray-400'
            }`}
          >
            <span className="text-xl">{item.icono}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </>
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
function SeccionCitas({ usuario, navigate, setSeccion }) {
  const estados = {
    confirmada: 'bg-green-100 text-green-700',
    pendiente: 'bg-yellow-100 text-yellow-700',
    cancelada: 'bg-red-100 text-red-700',
  }

  const citasPasadas = usuario.historial?.filter(h => !h.calificada) || []

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Próximas Citas</h2>
        
        {citasPasadas.length > 0 && (
  <div
    onClick={() => setSeccion('historial')}
    className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3 cursor-pointer hover:bg-yellow-100 transition"
  >
    <span className="text-2xl">⭐</span>
    <div>
      <p className="font-semibold text-yellow-800 text-sm">
        Tienes {citasPasadas.length} {citasPasadas.length === 1 ? 'consulta' : 'consultas'} por calificar
      </p>
      <p className="text-yellow-600 text-xs">Haz clic para calificar tu experiencia →</p>
    </div>
  </div>
)}
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

// --- MODAL DE CALIFICACIÓN ---
function ModalCalificacion({ consulta, onCerrar, onGuardar }) {
  const [calificacion, setCalificacion] = useState(0)
  const [hover, setHover] = useState(0)
  const [resena, setResena] = useState('')

  const guardar = () => {
    if (calificacion === 0) return
    onGuardar(consulta.id, calificacion, resena)
    onCerrar()
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-sky-50 px-6 py-5 border-b border-sky-100">
          <div className="flex justify-between items-center">
            <p className="font-bold text-gray-800">Calificar consulta</p>
            <button
              onClick={onCerrar}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">

          {/* Info del doctor */}
          <div className="flex items-center gap-4 bg-sky-50 rounded-2xl p-4 mb-6">
            <img
              src={consulta.imagen}
              alt={consulta.doctor}
              className="w-14 h-14 rounded-xl object-cover object-top flex-shrink-0"
            />
            <div>
              <p className="font-bold text-gray-800">{consulta.doctor}</p>
              <p className="text-sky-500 text-sm">{consulta.especialidad}</p>
              <p className="text-gray-400 text-xs">
                {new Date(consulta.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Estrellas */}
          <div className="text-center mb-6">
            <p className="text-gray-600 font-medium mb-3">¿Cómo fue tu experiencia?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((estrella) => (
                <button
                  key={estrella}
                  onMouseEnter={() => setHover(estrella)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setCalificacion(estrella)}
                  className="text-4xl transition-transform hover:scale-110"
                >
                  <span className={estrella <= (hover || calificacion) ? 'text-yellow-400' : 'text-gray-200'}>
                    ★
                  </span>
                </button>
              ))}
            </div>
            {calificacion > 0 && (
              <p className="text-sky-500 text-sm font-medium mt-2">
                {['', 'Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'][calificacion]}
              </p>
            )}
          </div>

          {/* Reseña */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Cuéntanos tu experiencia <span className="text-gray-400 font-normal">(opcional)</span>
            </label>
            <textarea
              value={resena}
              onChange={(e) => setResena(e.target.value)}
              placeholder="¿Cómo fue la atención? ¿Lo recomendarías?"
              rows={3}
              className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-sm resize-none"
            />
          </div>

          <button
            onClick={guardar}
            disabled={calificacion === 0}
            className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Enviar calificación
          </button>
        </div>

      </div>
    </div>
  )
}

// --- SECCIÓN HISTORIAL ---
function SeccionHistorial({ usuario }) {
  const { calificarConsulta } = useAuth()
  const [consultaACalificar, setConsultaACalificar] = useState(null)
  const [expandida, setExpandida] = useState(null)

  const pendientesCalificar = usuario.historial.filter(h => !h.calificada)

  const descargarResumen = (consulta) => {
    const contenido = `
RESUMEN DE CONSULTA — JELFEN
==============================
Doctor: ${consulta.doctor}
Especialidad: ${consulta.especialidad}
Fecha: ${new Date(consulta.fecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Hora: ${consulta.hora}
Tipo: ${consulta.tipo}
Costo: $${consulta.precio} MXN

DIAGNÓSTICO:
${consulta.diagnostico}

NOTAS DEL MÉDICO:
${consulta.notas}

RECETA / INDICACIONES:
${consulta.receta.map((r, i) => `${i + 1}. ${r}`).join('\n')}

==============================
Generado por Jelfen — Tu salud en buenas manos
    `.trim()

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `consulta-${consulta.doctor.replace(/\s/g, '-')}-${consulta.fecha}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-6">

      {consultaACalificar && (
        <ModalCalificacion
          consulta={consultaACalificar}
          onCerrar={() => setConsultaACalificar(null)}
          onGuardar={calificarConsulta}
        />
      )}

      <h2 className="text-2xl font-bold text-gray-800">Historial Médico</h2>

      {/* Pendientes de calificar */}
      {pendientesCalificar.length > 0 && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-5">
          <p className="font-bold text-yellow-800 mb-3 flex items-center gap-2">
            <span>⭐</span>
            {pendientesCalificar.length === 1 ? 'Tienes 1 consulta por calificar' : `Tienes ${pendientesCalificar.length} consultas por calificar`}
          </p>
          <div className="flex flex-col gap-2">
            {pendientesCalificar.map((consulta) => (
              <div key={consulta.id} className="flex items-center gap-3 bg-white rounded-xl p-3">
                <img src={consulta.imagen} alt={consulta.doctor} className="w-10 h-10 rounded-xl object-cover object-top flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">{consulta.doctor}</p>
                  <p className="text-gray-400 text-xs">{new Date(consulta.fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}</p>
                </div>
                <button
                  onClick={() => setConsultaACalificar(consulta)}
                  className="bg-yellow-400 text-yellow-900 text-xs font-bold px-4 py-2 rounded-full hover:bg-yellow-500 transition flex-shrink-0"
                >
                  Calificar ★
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lista de consultas */}
      {usuario.historial.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <p className="text-4xl mb-4">🏥</p>
          <p className="text-gray-500 font-medium">Aún no tienes consultas en tu historial</p>
          <p className="text-gray-400 text-sm mt-1">Tus consultas pasadas aparecerán aquí</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {usuario.historial.map((consulta) => (
            <div key={consulta.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* Header de la consulta */}
              <div className="p-5 flex items-center gap-4">

                {/* Fecha */}
                <div className="bg-sky-500 text-white rounded-xl p-3 text-center min-w-14 flex-shrink-0">
                  <p className="text-lg font-bold leading-none">
                    {new Date(consulta.fecha + 'T12:00:00').getDate()}
                  </p>
                  <p className="text-xs text-sky-200">
                    {new Date(consulta.fecha + 'T12:00:00').toLocaleString('es-MX', { month: 'short' })}
                  </p>
                </div>

                {/* Foto + info */}
                <img src={consulta.imagen} alt={consulta.doctor} className="w-12 h-12 rounded-xl object-cover object-top flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{consulta.doctor}</p>
                  <p className="text-sky-500 text-sm">{consulta.especialidad}</p>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span>🕐 {consulta.hora}</span>
                    <span>📋 {consulta.tipo}</span>
                    <span>💰 ${consulta.precio} MXN</span>
                  </div>
                </div>

                {/* Calificación o botón */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  {consulta.calificada ? (
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(e => (
                        <span key={e} className={`text-sm ${e <= consulta.calificacion ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => setConsultaACalificar(consulta)}
                      className="text-xs bg-yellow-50 border border-yellow-300 text-yellow-700 px-3 py-1.5 rounded-full hover:bg-yellow-100 transition font-medium"
                    >
                      Calificar ★
                    </button>
                  )}
                  <button
                    onClick={() => setExpandida(expandida === consulta.id ? null : consulta.id)}
                    className="text-xs text-sky-500 hover:underline"
                  >
                    {expandida === consulta.id ? 'Ocultar ▲' : 'Ver detalle ▼'}
                  </button>
                </div>

              </div>

              {/* Detalle expandible */}
              {expandida === consulta.id && (
                <div className="border-t border-gray-100 bg-sky-50 p-5 flex flex-col gap-4">

                  {/* Diagnóstico */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Diagnóstico</p>
                    <p className="text-gray-800 font-semibold">{consulta.diagnostico}</p>
                  </div>

                  {/* Notas */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Notas del médico</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{consulta.notas}</p>
                  </div>

                  {/* Receta */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Receta / Indicaciones</p>
                    <div className="flex flex-col gap-1">
                      {consulta.receta.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 bg-white rounded-xl px-4 py-2 border border-sky-100">
                          <span className="text-sky-500 font-bold text-sm flex-shrink-0">{i + 1}.</span>
                          <p className="text-gray-700 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reseña si fue calificada */}
                  {consulta.calificada && consulta.resena && (
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tu reseña</p>
                      <div className="bg-white rounded-xl p-3 border border-sky-100 flex items-start gap-2">
                        <div className="flex gap-0.5 flex-shrink-0 mt-0.5">
                          {[1,2,3,4,5].map(e => (
                            <span key={e} className={`text-xs ${e <= consulta.calificacion ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                          ))}
                        </div>
                        <p className="text-gray-600 text-sm italic">"{consulta.resena}"</p>
                      </div>
                    </div>
                  )}

                  {/* Botón descargar */}
                  <button
                    onClick={() => descargarResumen(consulta)}
                    className="flex items-center justify-center gap-2 bg-white border-2 border-sky-200 text-sky-600 py-2.5 rounded-xl text-sm font-semibold hover:bg-sky-50 transition"
                  >
                    📄 Descargar resumen de consulta
                  </button>

                </div>
              )}

            </div>
          ))}
        </div>
      )}
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
      case 'citas': return <SeccionCitas usuario={usuario} navigate={navigate} setSeccion={setSeccion} />
      case 'perfil': return <SeccionPerfil usuario={usuario} />
      case 'datos': return <SeccionProximamente titulo="Mis Datos" icono="📋" />
      case 'pagos': return <SeccionProximamente titulo="Pagos" icono="💳" />
      case 'historial': return <SeccionHistorial usuario={usuario} />
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