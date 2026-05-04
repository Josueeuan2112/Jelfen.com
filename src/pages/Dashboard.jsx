import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { doctores } from '../utils/doctores'
import BotonFavorito from '../components/BotonFavorito'

// --- SIDEBAR ---
function Sidebar({ seccion, setSeccion, onLogout }) {
  const items = [
    { id: 'citas', icono: '📅', label: 'Citas' },
    { id: 'favoritos', icono: '❤️', label: 'Favoritos' },
    { id: 'frecuentes', icono: '🔄', label: 'Frecuentes' },
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
function Calendario({ citas = []}) {
  const hoy = new Date()
  const [mes, setMes] = useState(hoy.getMonth())
  const [anio, setAnio] = useState(hoy.getFullYear())

  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
  const dias = ['Lu','Ma','Mi','Ju','Vi','Sa','Do']

  const primerDia = new Date(anio, mes, 1).getDay()
  const diasEnMes = new Date(anio, mes + 1, 0).getDate()
  const offset = primerDia === 0 ? 6 : primerDia - 1

  const diasConCita = citas
  .filter(c => {
    const f = new Date(c.fecha + 'T12:00:00')
    return f.getMonth() === mes && f.getFullYear() === anio && c.estado !== 'cancelada'
  })
  .map(c => new Date(c.fecha + 'T12:00:00').getDate())

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

function ModalCitaDetalle({ cita, onCerrar }) {
  const { cancelarCita, reprogramarCita } = useAuth()
  const doctorData = doctores.find(d => d.id === cita.doctorId)
  const [vista, setVista] = useState('detalle') // detalle | reprogramar | mensaje | cancelar
  const [nuevaFecha, setNuevaFecha] = useState(cita.fecha)
  const [nuevaHora, setNuevaHora] = useState(cita.hora)
  const [mensaje, setMensaje] = useState('')
  const [mensajeEnviado, setMensajeEnviado] = useState(false)
  const [confirmado, setConfirmado] = useState(false)

  const horas = doctorData?.disponibilidad?.manana?.length > 0
    ? doctorData.disponibilidad.manana
    : ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00']

  const fechaFormateada = new Date(cita.fecha + 'T12:00:00').toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const handleCancelar = () => {
    cancelarCita(cita.id)
    setConfirmado(true)
  }

  const handleReprogramar = () => {
    reprogramarCita(cita.id, nuevaFecha, nuevaHora)
    setConfirmado(true)
  }

  const handleMensaje = () => {
    if (!mensaje.trim()) return
    setMensajeEnviado(true)
  }

  const esCancelada = cita.estado === 'cancelada'

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="bg-sky-50 px-6 pt-5 pb-4 border-b border-sky-100 flex-shrink-0">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              {vista !== 'detalle' && !confirmado && (
                <button
                  onClick={() => { setVista('detalle'); setConfirmado(false) }}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition text-sm"
                >
                  ←
                </button>
              )}
              <p className="font-bold text-gray-800">
                {vista === 'detalle' && 'Detalle de Cita'}
                {vista === 'reprogramar' && 'Reprogramar Cita'}
                {vista === 'mensaje' && 'Mensaje al Médico'}
                {vista === 'cancelar' && 'Cancelar Cita'}
              </p>
            </div>
            <button
              onClick={onCerrar}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
            >
              ✕
            </button>
          </div>

          {/* Info del doctor siempre visible */}
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-sm rounded-2xl p-3 border border-sky-100">
            <img
              src={doctorData?.imagen || cita.imagen}
              alt={cita.doctor}
              className="w-12 h-12 rounded-xl object-cover object-top flex-shrink-0"
            />
            <div className="flex-1">
              <p className="font-bold text-gray-800 text-sm">{cita.doctor}</p>
              <p className="text-sky-500 text-xs">{cita.especialidad}</p>
              <div className="flex gap-1 mt-0.5">
                {[1,2,3,4,5].map(e => (
                  <span key={e} className={`text-xs ${e <= Math.round(doctorData?.calificacion || 5) ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                ))}
                <span className="text-xs text-gray-400 ml-1">{doctorData?.calificacion}</span>
              </div>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize flex-shrink-0 ${
              cita.estado === 'confirmada' ? 'bg-green-100 text-green-700' :
              cita.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {cita.estado}
            </span>
          </div>
        </div>

        {/* Contenido scrolleable */}
        <div className="p-6 overflow-y-auto flex-1">

          {/* ── VISTA DETALLE ── */}
          {vista === 'detalle' && (
            <div className="flex flex-col gap-4">

              {/* Resumen de la cita */}
              <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100 flex flex-col gap-3">
                {[
                  { icono: cita.tipo === 'videoconsulta' ? '💻' : '🏥', label: 'Tipo', valor: cita.tipo === 'videoconsulta' ? 'Videoconsulta' : 'Presencial' },
                  { icono: '📅', label: 'Fecha', valor: fechaFormateada },
                  { icono: '🕐', label: 'Hora', valor: cita.hora },
                  { icono: '📍', label: 'Lugar', valor: cita.tipo === 'videoconsulta' ? 'En línea — te enviamos el enlace' : doctorData?.ubicacion || 'Mérida, Yucatán' },
                  { icono: '💰', label: 'Costo', valor: `$${cita.precio} MXN` },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg w-7 flex-shrink-0">{item.icono}</span>
                    <span className="text-gray-400 text-sm w-16 flex-shrink-0">{item.label}</span>
                    <span className="text-gray-800 text-sm font-medium">{item.valor}</span>
                  </div>
                ))}
              </div>

              {/* Instrucciones según tipo */}
              {cita.tipo === 'videoconsulta' && !esCancelada && (
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-blue-700 text-sm font-semibold mb-1">💻 Tu videoconsulta</p>
                  <p className="text-blue-600 text-xs leading-relaxed">
                    El enlace de la videollamada se enviará a tu correo 30 minutos antes de la cita. Asegúrate de tener cámara y micrófono disponibles.
                  </p>
                </div>
              )}

              {/* Horarios del doctor */}
              {!esCancelada && (
                <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
                  <p className="text-green-700 text-sm font-semibold mb-1">🕐 Horario del consultorio</p>
                  <p className="text-green-600 text-xs">{doctorData?.horarios || 'Lunes a Viernes 9:00 - 17:00'}</p>
                </div>
              )}

              {/* Acciones — solo si no está cancelada */}
              {!esCancelada ? (
                <div className="flex flex-col gap-2 mt-2">
                  <button
                    onClick={() => setVista('mensaje')}
                    className="w-full flex items-center justify-center gap-2 bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition"
                  >
                    💬 Enviar mensaje al médico
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVista('reprogramar')}
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-sky-200 text-sky-600 py-3 rounded-xl font-semibold hover:bg-sky-50 transition text-sm"
                    >
                      📅 Reprogramar
                    </button>
                    <button
                      onClick={() => setVista('cancelar')}
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-red-200 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition text-sm"
                    >
                      ✕ Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 rounded-2xl p-4 border border-red-100 text-center">
                  <p className="text-red-500 font-semibold text-sm">Esta cita fue cancelada</p>
                  <p className="text-red-400 text-xs mt-1">Si necesitas atención, agenda una nueva cita</p>
                </div>
              )}

            </div>
          )}

          {/* ── VISTA REPROGRAMAR ── */}
          {vista === 'reprogramar' && !confirmado && (
            <div className="flex flex-col gap-4">
              <p className="text-gray-500 text-sm">Elige la nueva fecha y horario para tu cita</p>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Nueva fecha</label>
                <input
                  type="date"
                  value={nuevaFecha}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setNuevaFecha(e.target.value)}
                  className="w-full border-2 border-gray-100 bg-sky-50 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-gray-700 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Nuevo horario</label>
                <div className="grid grid-cols-4 gap-2">
                  {horas.map((h) => (
                    <button
                      key={h}
                      onClick={() => setNuevaHora(h)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition ${
                        nuevaHora === h
                          ? 'bg-sky-500 text-white border-sky-500'
                          : 'bg-sky-50 border-sky-100 text-gray-600 hover:border-sky-300'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex flex-col gap-1 text-sm">
                <p className="text-gray-500">Cita actual: <span className="font-semibold text-gray-700">{fechaFormateada} — {cita.hora}</span></p>
                {nuevaFecha && nuevaHora && (
                  <p className="text-sky-600">Nueva cita: <span className="font-semibold">
                    {new Date(nuevaFecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} — {nuevaHora}
                  </span></p>
                )}
              </div>

              <button
                onClick={handleReprogramar}
                disabled={!nuevaFecha || !nuevaHora}
                className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirmar Reprogramación
              </button>
            </div>
          )}

          {/* ── VISTA MENSAJE ── */}
          {vista === 'mensaje' && !mensajeEnviado && (
            <div className="flex flex-col gap-4">
              <p className="text-gray-500 text-sm">Tu mensaje será enviado directamente al médico antes de tu cita</p>

              <div className="flex flex-col gap-2">
                {['¿Necesito llevar estudios previos?', '¿Cómo me preparo para la consulta?', 'Tengo una pregunta antes de la cita', 'Necesito confirmar la dirección'].map((sugerencia, i) => (
                  <button
                    key={i}
                    onClick={() => setMensaje(sugerencia)}
                    className="text-left px-4 py-3 bg-sky-50 border border-sky-100 rounded-xl text-sm text-sky-700 hover:bg-sky-100 transition"
                  >
                    {sugerencia}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">O escribe tu mensaje</label>
                <textarea
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Escribe tu pregunta o comentario para el médico..."
                  rows={4}
                  className="w-full border-2 border-gray-100 bg-sky-50 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-sm resize-none"
                />
              </div>

              <button
                onClick={handleMensaje}
                disabled={!mensaje.trim()}
                className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Enviar mensaje 💬
              </button>
            </div>
          )}

          {/* ── MENSAJE ENVIADO ── */}
          {vista === 'mensaje' && mensajeEnviado && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">💬</div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">¡Mensaje enviado!</h3>
              <p className="text-gray-500 text-sm mb-2">Tu mensaje fue enviado a <span className="font-semibold text-sky-600">{cita.doctor}</span></p>
              <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 text-left my-4">
                <p className="text-xs text-gray-400 mb-1">Tu mensaje:</p>
                <p className="text-gray-700 text-sm italic">"{mensaje}"</p>
              </div>
              <p className="text-gray-400 text-xs">El médico responderá antes de tu cita del {fechaFormateada}</p>
            </div>
          )}

          {/* ── VISTA CANCELAR ── */}
          {vista === 'cancelar' && !confirmado && (
            <div className="flex flex-col gap-4">
              <div className="bg-red-50 rounded-2xl p-5 border border-red-100 text-center">
                <p className="text-4xl mb-3">⚠️</p>
                <p className="font-bold text-gray-800 mb-2">¿Cancelar esta cita?</p>
                <p className="text-gray-500 text-sm">
                  Estás a punto de cancelar tu cita con <span className="font-semibold">{cita.doctor}</span> el {fechaFormateada} a las {cita.hora}.
                </p>
              </div>

              <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                <p className="text-sky-700 text-sm font-semibold mb-2">📋 Política de cancelación</p>
                <div className="flex flex-col gap-1 text-xs text-sky-600">
                  <p>✅ Cancelación gratuita con más de 24 hrs de anticipación</p>
                  <p>⚠️ Cancelación con menos de 24 hrs puede tener cargo del 50%</p>
                  <p>❌ No show — cargo del 100% de la consulta</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setVista('detalle')}
                  className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  No cancelar
                </button>
                <button
                  onClick={handleCancelar}
                  className="flex-1 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition"
                >
                  Sí, cancelar
                </button>
              </div>
            </div>
          )}

          {/* ── CONFIRMACIÓN REPROGRAMAR / CANCELAR ── */}
          {confirmado && vista !== 'mensaje' && (
            <div className="text-center py-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 ${
                vista === 'cancelar' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {vista === 'cancelar' ? '✕' : '✅'}
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                {vista === 'cancelar' ? 'Cita cancelada' : '¡Cita reprogramada!'}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {vista === 'cancelar'
                  ? 'Tu cita ha sido cancelada. Puedes agendar una nueva cuando gustes.'
                  : `Tu cita fue reprogramada para el ${new Date(nuevaFecha + 'T12:00:00').toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} a las ${nuevaHora}.`
                }
              </p>
              <button
                onClick={onCerrar}
                className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition"
              >
                Entendido
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

// --- SECCIÓN CITAS ---
function SeccionCitas({ usuario, navigate, setSeccion, citaInicial, onCitaInicialVista }) {
  const citasPasadas = usuario.historial?.filter(h => !h.calificada) || []
  const [citaSeleccionada, setCitaSeleccionada] = useState(null)

  const estados = {
    confirmada: 'bg-green-100 text-green-700',
    pendiente: 'bg-yellow-100 text-yellow-700',
    cancelada: 'bg-red-100 text-red-700',
  }

  useEffect(() => {
    if (citaInicial) {
      setCitaSeleccionada(citaInicial)
      onCitaInicialVista()
    }
  }, [citaInicial])

  return (
    <div className="flex flex-col gap-6">

      {citaSeleccionada && (
        <ModalCitaDetalle
          cita={citaSeleccionada}
          onCerrar={() => setCitaSeleccionada(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Próximas Citas</h2>
        <button
          onClick={() => navigate('/doctores')}
          className="bg-sky-500 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-sky-600 transition flex items-center gap-2"
        >
          + Agendar Nueva Cita
        </button>
      </div>

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

      {usuario.citas.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <p className="text-4xl mb-4">📅</p>
          <p className="text-gray-500">No tienes citas programadas</p>
          <button onClick={() => navigate('/doctores')} className="mt-4 text-sky-500 hover:underline text-sm">
            Buscar un doctor
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {usuario.citas.map((cita) => {
            const doctorData = doctores.find(d => d.id === cita.doctorId)
            const imagen = doctorData?.imagen || cita.imagen

            return (
              <button
                key={cita.id}
                onClick={() => setCitaSeleccionada(cita)}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-sky-200 transition flex items-center gap-4 text-left w-full group"
              >
                <div className="bg-sky-500 text-white rounded-xl p-3 text-center min-w-14 flex-shrink-0">
                  <p className="text-xl font-bold leading-none">
                    {new Date(cita.fecha + 'T12:00:00').getDate()}
                  </p>
                  <p className="text-xs text-sky-200">
                    {new Date(cita.fecha + 'T12:00:00').toLocaleString('es-MX', { month: 'short' })}
                  </p>
                </div>

                <img
                  src={imagen}
                  alt={cita.doctor}
                  className="w-12 h-12 rounded-xl object-cover object-top flex-shrink-0 border-2 border-sky-100"
                />

                <div className="flex-1">
                  <p className="font-bold text-gray-800">{cita.doctor}</p>
                  <p className="text-sky-500 text-sm">{cita.especialidad}</p>
                  <div className="flex gap-3 mt-1 text-xs text-gray-400">
                    <span>🕐 {cita.hora}</span>
                    <span>📋 {cita.tipo}</span>
                    <span>💰 ${cita.precio} MXN</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${estados[cita.estado]}`}>
                    {cita.estado}
                  </span>
                  <span className="text-sky-300 group-hover:text-sky-500 transition text-sm">→</span>
                </div>
              </button>
            )
          })}
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

// ----- NOTIFICACIONES -----
function SeccionNotificaciones() {
  const { notificaciones, marcarLeida, marcarTodasLeidas } = useAuth()
  const noLeidas = notificaciones?.filter(n => !n.leida).length || 0

  const colores = {
    cita: 'bg-sky-50 border-sky-200',
    recordatorio: 'bg-yellow-50 border-yellow-200',
    mensaje: 'bg-green-50 border-green-200',
    sistema: 'bg-gray-50 border-gray-200',
  }

  return (
    <div className="flex flex-col gap-6">

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notificaciones</h2>
          {noLeidas > 0 && (
            <p className="text-sky-500 text-sm mt-1">{noLeidas} sin leer</p>
          )}
        </div>
        {noLeidas > 0 && (
          <button
            onClick={marcarTodasLeidas}
            className="text-sm text-sky-500 hover:underline font-medium"
          >
            Marcar todas como leídas
          </button>
        )}
      </div>

      {notificaciones?.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <p className="text-5xl mb-4">🔔</p>
          <p className="text-gray-500 font-medium">No tienes notificaciones</p>
          <p className="text-gray-400 text-sm mt-1">Aquí aparecerán tus avisos y recordatorios</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {notificaciones.map((notif) => (
            <button
              key={notif.id}
              onClick={() => marcarLeida(notif.id)}
              className={`w-full text-left rounded-2xl p-5 border-2 transition hover:shadow-md ${
                notif.leida
                  ? 'bg-white border-gray-100 opacity-70'
                  : colores[notif.tipo] || colores.sistema
              }`}
            >
              <div className="flex items-start gap-4">

                {/* Ícono */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  notif.leida ? 'bg-gray-100' : 'bg-white shadow-sm'
                }`}>
                  {notif.icono}
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className={`font-bold text-sm ${notif.leida ? 'text-gray-500' : 'text-gray-800'}`}>
                      {notif.titulo}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{notif.fecha}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${notif.leida ? 'text-gray-400' : 'text-gray-600'}`}>
                    {notif.mensaje}
                  </p>
                </div>

                {/* Punto de no leída */}
                {!notif.leida && (
                  <div className="w-3 h-3 bg-sky-500 rounded-full flex-shrink-0 mt-1" />
                )}

              </div>
            </button>
          ))}
        </div>
      )}

    </div>
  )
}

function SeccionFavoritos({ navigate }) {
  const { favoritos, esFavorito } = useAuth()
  const [doctorSeleccionado, setDoctorSeleccionado] = useState(null)

  const doctoresFavoritos = doctores.filter(d => favoritos.includes(d.id))

  return (
    <div className="flex flex-col gap-6">

      {doctorSeleccionado && (
        <ModalCitaDetalle
          cita={{ doctorId: doctorSeleccionado.id, doctor: doctorSeleccionado.nombre, especialidad: doctorSeleccionado.especialidad, imagen: doctorSeleccionado.imagen, estado: 'nueva' }}
          onCerrar={() => setDoctorSeleccionado(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mis Favoritos</h2>
          <p className="text-gray-400 text-sm mt-1">
            {doctoresFavoritos.length === 0
              ? 'Guarda doctores para acceder rápido'
              : `${doctoresFavoritos.length} ${doctoresFavoritos.length === 1 ? 'doctor guardado' : 'doctores guardados'}`
            }
          </p>
        </div>
        <button
          onClick={() => navigate('/buscar')}
          className="text-sky-500 hover:underline text-sm font-medium"
        >
          Buscar más →
        </button>
      </div>

      {doctoresFavoritos.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <p className="text-5xl mb-4">🤍</p>
          <p className="text-gray-500 font-medium mb-1">No tienes favoritos todavía</p>
          <p className="text-gray-400 text-sm mb-6">Toca el ❤️ en cualquier tarjeta de doctor para guardarlo aquí</p>
          <button
            onClick={() => navigate('/doctores')}
            className="bg-sky-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-sky-600 transition"
          >
            Explorar doctores
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {doctoresFavoritos.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Imagen */}
              <div className="relative">
                <img
                  src={doctor.imagen}
                  alt={doctor.nombre}
                  className="w-full h-36 object-cover object-top"
                />
                <div className="absolute top-2 left-2">
                  <BotonFavorito doctorId={doctor.id} />
                </div>
                {doctor.verificado && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    ✅ SEP
                  </span>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-gray-800">{doctor.nombre}</h3>
                <p className="text-sky-500 text-sm mb-1">{doctor.especialidad}</p>
                <div className="flex items-center gap-1 mb-1">
                  <span className="text-yellow-400 text-sm">★</span>
                  <span className="font-semibold text-gray-800 text-sm">{doctor.calificacion}</span>
                  <span className="text-gray-400 text-xs">· {doctor.resenas} reseñas</span>
                </div>
                <p className="text-gray-500 text-xs mb-3">📍 {doctor.ubicacion}</p>

                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <Link
                    to={`/doctor/${doctor.id}`}
                    className="flex-1 border border-sky-500 text-sky-500 py-2 rounded-xl text-xs font-semibold text-center hover:bg-sky-50 transition"
                  >
                    Ver Perfil
                  </Link>
                  <button
                    onClick={() => navigate(`/doctor/${doctor.id}`)}
                    className="flex-1 bg-sky-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-sky-600 transition"
                  >
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function SeccionMedicosFrecuentes({ navigate }) {
  const { usuario, getMedicosFrecuentes, esFavorito, toggleFavorito } = useAuth()
  const [modalAbierto, setModalAbierto] = useState(null)
  const frecuentes = getMedicosFrecuentes()

  const obtenerInsignia = (visitas) => {
    if (visitas >= 4) return { label: 'Mi doctor de confianza', color: 'bg-yellow-100 text-yellow-700', icono: '🏆' }
    if (visitas >= 3) return { label: 'Frecuente', color: 'bg-sky-100 text-sky-700', icono: '⭐' }
    return { label: 'Visitado', color: 'bg-gray-100 text-gray-600', icono: '✅' }
  }

  return (
    <div className="flex flex-col gap-6">

      {modalAbierto && (
        <ModalCitaDetalle
          cita={modalAbierto}
          onCerrar={() => setModalAbierto(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Mis Médicos Frecuentes</h2>
          <p className="text-gray-400 text-sm mt-1">
            Doctores con los que más has consultado
          </p>
        </div>
        <button
          onClick={() => navigate('/buscar')}
          className="text-sky-500 hover:underline text-sm font-medium"
        >
          Buscar más →
        </button>
      </div>

      {frecuentes.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-gray-100 shadow-sm">
          <p className="text-5xl mb-4">👨‍⚕️</p>
          <p className="text-gray-500 font-medium mb-1">Aún no tienes médicos frecuentes</p>
          <p className="text-gray-400 text-sm mb-6">
            Cuando hayas tenido varias consultas con el mismo doctor, aparecerá aquí para acceso rápido
          </p>
          <button
            onClick={() => navigate('/doctores')}
            className="bg-sky-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-sky-600 transition"
          >
            Encontrar un doctor
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">

          {/* Doctor principal — el más frecuente */}
          {frecuentes[0] && (
            <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl p-6 flex flex-col md:flex-row gap-5 items-center">

              <div className="relative flex-shrink-0">
                <img
                  src={frecuentes[0].doctor.imagen}
                  alt={frecuentes[0].doctor.nombre}
                  className="w-24 h-24 rounded-2xl object-cover object-top border-4 border-white/30 shadow-lg"
                />
                <span className="absolute -top-2 -right-2 text-2xl">🏆</span>
              </div>

              <div className="flex-1 text-center md:text-left">
                <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                  Tu doctor de confianza
                </span>
                <h3 className="text-xl font-bold text-white">{frecuentes[0].doctor.nombre}</h3>
                <p className="text-sky-200 mb-1">{frecuentes[0].doctor.especialidad}</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm text-sky-100">
                  <span>⭐ {frecuentes[0].doctor.calificacion}</span>
                  <span>🔄 {frecuentes[0].visitas} {frecuentes[0].visitas === 1 ? 'consulta' : 'consultas'}</span>
                  <span>📍 {frecuentes[0].doctor.ubicacion}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => navigate(`/doctor/${frecuentes[0].doctor.id}`)}
                  className="bg-white text-sky-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-sky-50 transition text-sm"
                >
                  Ver Perfil
                </button>
                <button
                  onClick={() => {
                    const ultimaCita = [...(usuario?.citas || []), ...(usuario?.historial || [])]
                      .filter(c => c.doctorId === frecuentes[0].doctor.id)
                      .at(-1)
                    if (ultimaCita) setModalAbierto(ultimaCita)
                    else navigate(`/doctor/${frecuentes[0].doctor.id}`)
                  }}
                  className="bg-white/20 border border-white/30 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-white/30 transition text-sm"
                >
                  Nueva Cita
                </button>
              </div>

            </div>
          )}

          {/* Resto de doctores frecuentes */}
          {frecuentes.slice(1).map(({ doctor, visitas }) => {
            const insignia = obtenerInsignia(visitas)
            const esFav = esFavorito(doctor.id)

            return (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition p-5 flex items-center gap-4"
              >

                {/* Imagen */}
                <div className="relative flex-shrink-0">
                  <img
                    src={doctor.imagen}
                    alt={doctor.nombre}
                    className="w-16 h-16 rounded-2xl object-cover object-top border-2 border-sky-100"
                  />
                  <span className="absolute -top-1 -right-1 text-sm">{insignia.icono}</span>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="font-bold text-gray-800">{doctor.nombre}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${insignia.color}`}>
                      {insignia.label}
                    </span>
                  </div>
                  <p className="text-sky-500 text-sm">{doctor.especialidad}</p>
                  <div className="flex gap-3 text-xs text-gray-400 mt-1">
                    <span>⭐ {doctor.calificacion}</span>
                    <span>🔄 {visitas} {visitas === 1 ? 'consulta' : 'consultas'}</span>
                    <span>📍 {doctor.ubicacion}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => toggleFavorito(doctor.id)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                      esFav ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400 hover:bg-red-50 hover:text-red-400'
                    }`}
                  >
                    {esFav ? '❤️' : '🤍'}
                  </button>
                  <button
                    onClick={() => navigate(`/doctor/${doctor.id}`)}
                    className="w-9 h-9 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-100 transition text-lg"
                  >
                    →
                  </button>
                </div>

              </div>
            )
          })}

          {/* Tip al final */}
          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="text-sky-700 font-semibold text-sm">¿Sabías que?</p>
              <p className="text-sky-600 text-xs mt-0.5 leading-relaxed">
                Mantener seguimiento con el mismo médico mejora tu salud a largo plazo. Jelfen recuerda tu historial para que no tengas que repetirlo cada vez.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}

// --- PÁGINA COMPLETA ---
function Dashboard() {
  const { usuario, logout, getMedicosFrecuentes } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [seccion, setSeccion] = useState('citas')
  const [citaSeleccionadaInicial, setCitaSeleccionadaInicial] = useState(null)

  useEffect(() => {
    if (location.state?.abrirCitaDoctor && usuario?.citas) {
      const cita = usuario.citas
        .filter(c => c.doctorId === location.state.abrirCitaDoctor)
        .at(-1)
      if (cita) {
        setSeccion('citas')
        setCitaSeleccionadaInicial(cita)
      }
    }
  }, [location.state, usuario])

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
      case 'citas': return (
        <SeccionCitas
          usuario={usuario}
          navigate={navigate}
          setSeccion={setSeccion}
          citaInicial={citaSeleccionadaInicial}
          onCitaInicialVista={() => setCitaSeleccionadaInicial(null)}
        />
      )
      case 'perfil': return <SeccionPerfil usuario={usuario} />
      case 'datos': return <SeccionProximamente titulo="Mis Datos" icono="📋" />
      case 'pagos': return <SeccionProximamente titulo="Pagos" icono="💳" />
      case 'historial': return <SeccionHistorial usuario={usuario} />
      case 'notificaciones': return <SeccionNotificaciones />
      case 'favoritos': return <SeccionFavoritos navigate={navigate} /> 
      case 'frecuentes': return <SeccionMedicosFrecuentes navigate={navigate} />
      default: return null
    }
  }

 return (
  <div className="flex min-h-screen bg-sky-50">
    <Sidebar seccion={seccion} setSeccion={setSeccion} onLogout={onLogout} />

    <div className="flex-1 flex flex-col min-w-0">

      {/* Header */}
      <div className="bg-sky-50 border-b border-gray-100 px-4 md:px-8 py-4 flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-bold text-gray-800">— Mi Cuenta</h1>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 bg-sky-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {usuario.avatar}
          </div>
          <p className="font-semibold text-gray-700 text-sm hidden sm:block">{usuario.nombre}</p>
          <button onClick={onLogout} className="text-gray-400 hover:text-red-400 transition text-xl" title="Cerrar sesión">→</button>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex gap-6 p-4 md:p-8 pb-20 md:pb-8">

        {/* Main — full width en mobile */}
        <div className="flex-1 min-w-0">
          {renderSeccion()}
        </div>

        {/* Panel derecho — solo desktop */}
        <div className="hidden lg:flex w-72 flex-col gap-5 flex-shrink-0">
          <Calendario citas={usuario.citas} />

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

          {getMedicosFrecuentes().length > 0 && (
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-gray-800">🔄 Mis Médicos</h3>
                <button onClick={() => setSeccion('frecuentes')} className="text-xs text-sky-500 hover:underline">Ver todos →</button>
              </div>
              <div className="flex flex-col gap-2">
                {getMedicosFrecuentes().slice(0, 3).map(({ doctor, visitas }) => (
                  <button key={doctor.id} onClick={() => navigate(`/doctor/${doctor.id}`)} className="flex items-center gap-3 hover:bg-sky-50 p-2 rounded-xl transition text-left w-full">
                    <img src={doctor.imagen} alt={doctor.nombre} className="w-10 h-10 rounded-xl object-cover object-top flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-xs truncate">{doctor.nombre}</p>
                      <p className="text-sky-500 text-xs">{doctor.especialidad}</p>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{visitas}x</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-3">⭐ Recomendaciones</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">
              Basado en tu historial, te recomendamos una revisión general cada 6 meses.
            </p>
            <button onClick={() => navigate('/doctores')} className="w-full bg-sky-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-sky-600 transition">
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