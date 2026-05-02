import { useState } from 'react'

const PASOS = ['Tipo', 'Fecha y Hora', 'Confirmar']

function BarraPasos({ pasoActual }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {PASOS.map((nombre, i) => (
        <div key={i} className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
              i < pasoActual ? 'bg-green-500 text-white' :
              i === pasoActual ? 'bg-sky-500 text-white' :
              'bg-gray-100 text-gray-400'
            }`}>
              {i < pasoActual ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${
              i === pasoActual ? 'text-sky-600' : 'text-gray-400'
            }`}>
              {nombre}
            </span>
          </div>
          {i < PASOS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-2 rounded-full transition ${
              i < pasoActual ? 'bg-green-400' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )
}

function Paso1Tipo({ doctor, tipo, setTipo }) {
  const opciones = []
  if (doctor.modalidad === 'videoconsulta' || doctor.modalidad === 'ambas') {
    opciones.push({
      id: 'videoconsulta',
      icono: '💻',
      titulo: 'Videoconsulta',
      descripcion: 'Consulta desde cualquier lugar vía video',
      detalle: 'Sin desplazamientos · Desde tu hogar',
    })
  }
  if (doctor.modalidad === 'presencial' || doctor.modalidad === 'ambas') {
    opciones.push({
      id: 'presencial',
      icono: '🏥',
      titulo: 'Presencial',
      descripcion: `En consultorio · ${doctor.ubicacion}`,
      detalle: 'Atención directa con el médico',
    })
  }

  return (
    <div>
      <h3 className="font-bold text-gray-800 text-lg mb-1">¿Cómo prefieres tu consulta?</h3>
      <p className="text-gray-400 text-sm mb-5">Selecciona el tipo de atención</p>
      <div className="flex flex-col gap-3">
        {opciones.map((op) => (
          <button
            key={op.id}
            onClick={() => setTipo(op.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition text-left ${
              tipo === op.id
                ? 'border-sky-500 bg-sky-50'
                : 'border-gray-100 bg-gray-50 hover:border-sky-200'
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
              tipo === op.id ? 'bg-sky-100' : 'bg-white'
            }`}>
              {op.icono}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-800">{op.titulo}</p>
              <p className="text-gray-500 text-sm">{op.descripcion}</p>
              <p className="text-sky-500 text-xs mt-1">{op.detalle}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              tipo === op.id ? 'border-sky-500 bg-sky-500' : 'border-gray-300'
            }`}>
              {tipo === op.id && <span className="text-white text-xs">✓</span>}
            </div>
          </button>
        ))}
      </div>

      {/* Info del doctor */}
      <div className="mt-5 bg-sky-50 rounded-2xl p-4 flex items-center gap-4">
        <img
          src={doctor.imagen}
          alt={doctor.nombre}
          className="w-12 h-12 rounded-xl object-cover object-top flex-shrink-0"
        />
        <div>
          <p className="font-bold text-gray-800 text-sm">{doctor.nombre}</p>
          <p className="text-sky-500 text-xs">{doctor.especialidad}</p>
          <p className="text-gray-400 text-xs">⭐ {doctor.calificacion} · {doctor.resenas} reseñas</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-gray-400 text-xs">Desde</p>
          <p className="font-bold text-gray-800">${doctor.precio} MXN</p>
        </div>
      </div>
    </div>
  )
}

function Paso2FechaHora({ fecha, setFecha, hora, setHora, doctor }) {
  const horas = doctor.disponibilidad?.hoy?.length > 0
    ? doctor.disponibilidad.hoy
    : ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00']

  const hoy = new Date()
  const manana = new Date(hoy)
  manana.setDate(hoy.getDate() + 1)
  const pasado = new Date(hoy)
  pasado.setDate(hoy.getDate() + 2)

  const fechasRapidas = [
    { label: 'Hoy', value: hoy.toISOString().split('T')[0], horas: doctor.disponibilidad?.hoy || [] },
    { label: 'Mañana', value: manana.toISOString().split('T')[0], horas: doctor.disponibilidad?.manana || [] },
    { label: pasado.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }), value: pasado.toISOString().split('T')[0], horas: doctor.disponibilidad?.pasado || [] },
  ]

  const [diaRapido, setDiaRapido] = useState(null)

  const elegirDiaRapido = (dia) => {
    setDiaRapido(dia.value)
    setFecha(dia.value)
    setHora('')
  }

  const horasActuales = diaRapido
    ? fechasRapidas.find(f => f.value === diaRapido)?.horas || horas
    : horas

  return (
    <div>
      <h3 className="font-bold text-gray-800 text-lg mb-1">Elige fecha y horario</h3>
      <p className="text-gray-400 text-sm mb-5">Selecciona cuándo quieres tu consulta</p>

      {/* Fechas rápidas */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Disponibilidad próxima</p>
      <div className="flex gap-2 mb-4">
        {fechasRapidas.map((dia) => (
          <button
            key={dia.value}
            onClick={() => elegirDiaRapido(dia)}
            className={`flex-1 py-3 rounded-xl border-2 text-xs font-semibold transition ${
              diaRapido === dia.value
                ? 'border-sky-500 bg-sky-50 text-sky-700'
                : 'border-gray-100 text-gray-500 hover:border-sky-200'
            }`}
          >
            <p>{dia.label}</p>
            <p className={`text-xs font-normal mt-0.5 ${dia.horas.length > 0 ? 'text-green-500' : 'text-red-400'}`}>
              {dia.horas.length > 0 ? `${dia.horas.length} lugares` : 'Sin espacio'}
            </p>
          </button>
        ))}
      </div>

      {/* Fecha manual */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">O elige otra fecha</p>
      <input
        type="date"
        value={fecha}
        min={new Date().toISOString().split('T')[0]}
        onChange={(e) => { setFecha(e.target.value); setDiaRapido(null); setHora('') }}
        className="w-full border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-gray-600 text-sm mb-4"
      />

      {/* Horarios */}
      {fecha && (
        <>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Horarios disponibles</p>
          {horasActuales.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {horasActuales.map((h) => (
                <button
                  key={h}
                  onClick={() => setHora(h)}
                  className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition ${
                    hora === h
                      ? 'bg-sky-500 text-white border-sky-500 shadow-md'
                      : 'bg-gray-50 border-gray-100 text-gray-600 hover:border-sky-300 hover:bg-sky-50'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-gray-400 text-sm">Sin horarios este día</p>
              <p className="text-sky-500 text-xs mt-1">Prueba con otra fecha</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function Paso3Confirmar({ doctor, tipo, fecha, hora }) {
  const fechaFormateada = new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div>
      <h3 className="font-bold text-gray-800 text-lg mb-1">Confirma tu cita</h3>
      <p className="text-gray-400 text-sm mb-5">Revisa los detalles antes de agendar</p>

      {/* Card resumen — glassmorphism */}
      <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100 mb-4">

        {/* Doctor */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-sky-100">
          <img
            src={doctor.imagen}
            alt={doctor.nombre}
            className="w-14 h-14 rounded-xl object-cover object-top flex-shrink-0"
          />
          <div>
            <p className="font-bold text-gray-800">{doctor.nombre}</p>
            <p className="text-sky-500 text-sm">{doctor.especialidad}</p>
            {doctor.verificado && (
              <span className="text-xs text-green-600 font-semibold">✅ Verificado SEP</span>
            )}
          </div>
        </div>

        {/* Detalles */}
        <div className="flex flex-col gap-3">
          {[
            { icono: tipo === 'videoconsulta' ? '💻' : '🏥', label: 'Tipo', valor: tipo === 'videoconsulta' ? 'Videoconsulta' : 'Presencial' },
            { icono: '📅', label: 'Fecha', valor: fechaFormateada },
            { icono: '🕐', label: 'Hora', valor: hora },
            { icono: '📍', label: 'Lugar', valor: tipo === 'videoconsulta' ? 'En línea — te enviamos el enlace' : doctor.ubicacion },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg w-7">{item.icono}</span>
              <span className="text-gray-400 text-sm w-16 flex-shrink-0">{item.label}</span>
              <span className="text-gray-800 text-sm font-medium">{item.valor}</span>
            </div>
          ))}
        </div>

      </div>

      {/* Total */}
      <div className="bg-white rounded-2xl p-4 border-2 border-sky-200 flex justify-between items-center mb-2">
        <div>
          <p className="text-gray-500 text-sm">Total a pagar</p>
          <p className="text-xs text-gray-400">Pago seguro en plataforma</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-sky-500">${doctor.precio}</p>
          <p className="text-gray-400 text-xs">MXN</p>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-center">
        🔒 Pago seguro · Puedes cancelar hasta 24 hrs antes sin cargo
      </p>
    </div>
  )
}

function PasoExito({ doctor, tipo, fecha, hora, onCerrar }) {
  const fechaFormateada = new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  return (
    <div className="text-center py-4">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
        🎉
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">¡Cita confirmada!</h3>
      <p className="text-gray-500 mb-6">Te enviamos los detalles a tu correo</p>

      <div className="bg-sky-50 rounded-2xl p-5 text-left border border-sky-100 mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img src={doctor.imagen} alt={doctor.nombre} className="w-12 h-12 rounded-xl object-cover object-top" />
          <div>
            <p className="font-bold text-gray-800">{doctor.nombre}</p>
            <p className="text-sky-500 text-sm">{doctor.especialidad}</p>
          </div>
        </div>
        <div className="border-t border-sky-100 pt-3 flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Fecha</span>
            <span className="font-semibold text-gray-800 capitalize">{fechaFormateada}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Hora</span>
            <span className="font-semibold text-gray-800">{hora}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Tipo</span>
            <span className="font-semibold text-gray-800 capitalize">{tipo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total pagado</span>
            <span className="font-bold text-sky-500">${doctor.precio} MXN</span>
          </div>
        </div>
      </div>

      {tipo === 'videoconsulta' && (
        <div className="bg-blue-50 rounded-2xl p-4 text-left border border-blue-100 mb-4">
          <p className="text-blue-700 text-sm font-semibold mb-1">💻 ¿Cómo funciona tu videoconsulta?</p>
          <p className="text-blue-600 text-xs">El médico te enviará el enlace de la videollamada 30 minutos antes de tu cita al correo registrado.</p>
        </div>
      )}

      <button
        onClick={onCerrar}
        className="w-full bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition"
      >
        Entendido
      </button>
    </div>
  )
}

function ModalCita({ doctor, onCerrar }) {
  const [paso, setPaso] = useState(0)
  const [tipo, setTipo] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [confirmado, setConfirmado] = useState(false)

  const puedeAvanzar = () => {
    if (paso === 0) return tipo !== ''
    if (paso === 1) return fecha !== '' && hora !== ''
    return true
  }

  const confirmar = () => setConfirmado(true)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-sky-50 px-6 pt-6 pb-4 border-b border-sky-100">
          <div className="flex justify-between items-center mb-4">
            <p className="font-bold text-gray-800">Reservar Cita</p>
            <button
              onClick={onCerrar}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition"
            >
              ✕
            </button>
          </div>
          {!confirmado && <BarraPasos pasoActual={paso} />}
        </div>

        {/* Contenido */}
        <div className="p-6">
          {confirmado ? (
            <PasoExito doctor={doctor} tipo={tipo} fecha={fecha} hora={hora} onCerrar={onCerrar} />
          ) : (
            <>
              {paso === 0 && <Paso1Tipo doctor={doctor} tipo={tipo} setTipo={setTipo} />}
              {paso === 1 && <Paso2FechaHora doctor={doctor} fecha={fecha} setFecha={setFecha} hora={hora} setHora={setHora} />}
              {paso === 2 && <Paso3Confirmar doctor={doctor} tipo={tipo} fecha={fecha} hora={hora} />}

              {/* Navegación */}
              <div className="flex gap-3 mt-6">
                {paso > 0 && (
                  <button
                    onClick={() => setPaso(paso - 1)}
                    className="flex-1 border-2 border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
                  >
                    ← Atrás
                  </button>
                )}
                {paso < 2 ? (
                  <button
                    onClick={() => setPaso(paso + 1)}
                    disabled={!puedeAvanzar()}
                    className="flex-1 bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Continuar →
                  </button>
                ) : (
                  <button
                    onClick={confirmar}
                    className="flex-1 bg-sky-500 text-white py-3 rounded-xl font-semibold hover:bg-sky-600 transition"
                  >
                    ✅ Confirmar y Pagar
                  </button>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}

export default ModalCita