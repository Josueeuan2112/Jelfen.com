import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { preguntarAClaude } from '../utils/api'

// Mapa de síntomas → especialidad → URL del buscador
const MAPA_ESPECIALIDADES = {
  'Neurología': {
    sintomas: ['cabeza', 'migraña', 'mareo', 'convulsión', 'memoria', 'desmayo', 'hormigueo', 'epilepsia', 'vértigo', 'cefalea', 'dolor de cabeza'],
    descripcion: 'Neurología — especialistas en sistema nervioso',
    emoji: '🧠',
  },
  'Cardiología': {
    sintomas: ['corazón', 'pecho', 'palpitaciones', 'presión', 'infarto', 'arritmia', 'latido', 'taquicardia', 'bradicardia', 'cardiovascular'],
    descripcion: 'Cardiología — especialistas en corazón',
    emoji: '❤️',
  },
  'Dermatología': {
    sintomas: ['piel', 'acné', 'manchas', 'sarpullido', 'comezón', 'urticaria', 'psoriasis', 'eczema', 'lunar', 'rozadura', 'picazón'],
    descripcion: 'Dermatología — especialistas en piel',
    emoji: '🌿',
  },
  'Pediatría': {
    sintomas: ['niño', 'bebé', 'hijo', 'infantil', 'lactante', 'pediatría', 'recién nacido', 'vacuna', 'fiebre niño'],
    descripcion: 'Pediatría — especialistas en niños',
    emoji: '👶',
  },
  'Traumatología': {
    sintomas: ['hueso', 'fractura', 'rodilla', 'espalda', 'columna', 'tobillo', 'muñeca', 'articulación', 'luxación', 'lesión deportiva', 'dolor de espalda', 'lumbar'],
    descripcion: 'Traumatología — especialistas en huesos y articulaciones',
    emoji: '🦴',
  },
  'Oftalmología': {
    sintomas: ['ojo', 'vista', 'visión', 'lentes', 'glaucoma', 'catarata', 'miopía', 'astigmatismo', 'lagrimeo', 'irritación ocular'],
    descripcion: 'Oftalmología — especialistas en ojos',
    emoji: '👁️',
  },
  'Odontología': {
    sintomas: ['diente', 'muela', 'encía', 'dental', 'boca', 'caries', 'ortodoncia', 'implante', 'dolor de muela', 'sensibilidad dental'],
    descripcion: 'Odontología — especialistas en salud dental',
    emoji: '🦷',
  },
  'Psicología': {
    sintomas: ['ansiedad', 'depresión', 'estrés', 'tristeza', 'pánico', 'insomnio', 'nervios', 'angustia', 'mente', 'emocional', 'mental', 'fobia', 'trauma'],
    descripcion: 'Psicología — especialistas en salud mental',
    emoji: '🧘',
  },
  'Medicina General': {
    sintomas: ['fiebre', 'gripa', 'resfriado', 'tos', 'dolor general', 'malestar', 'cansancio', 'náuseas', 'vómito', 'diarrea', 'gripe', 'temperatura'],
    descripcion: 'Medicina General — atención primaria',
    emoji: '🩺',
  },
}

function detectarEspecialidad(texto) {
  const lower = texto.toLowerCase()
  for (const [especialidad, data] of Object.entries(MAPA_ESPECIALIDADES)) {
    if (data.sintomas.some(s => lower.includes(s))) {
      return { especialidad, ...data }
    }
  }
  return null
}

function ChatBot() {
  const navigate = useNavigate()
  const [abierto, setAbierto] = useState(false)
  const [rol, setRol] = useState(null)
  const [mensajes, setMensajes] = useState([])
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)
  const [sugerencia, setSugerencia] = useState(null)
  const [contexto, setContexto] = useState({ sintomas: [], nombre: null })
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [mensajes, cargando])

  const elegirRol = (rolElegido) => {
    setRol(rolElegido)
    const bienvenida = rolElegido === 'paciente'
      ? '¡Hola! Soy el asistente de Jelfen 👋\n\nPuedo ayudarte a:\n• Identificar qué especialista necesitas\n• Encontrar el doctor ideal\n• Resolver dudas sobre citas\n\n¿Cómo te llamas y en qué puedo ayudarte hoy?'
      : '¡Bienvenido a Jelfen! 👨‍⚕️\n\nPuedo ayudarte con:\n• Proceso de registro y verificación\n• Cómo funciona tu perfil\n• Información sobre comisiones y pagos\n\n¿En qué te puedo orientar?'
    setMensajes([{ role: 'assistant', content: bienvenida }])
  }

  const enviarMensaje = async () => {
    if (!input.trim() || cargando) return

    const texto = input.trim()
    const nuevosMensajes = [...mensajes, { role: 'user', content: texto }]
    setMensajes(nuevosMensajes)
    setInput('')
    setCargando(true)
    setSugerencia(null)

    // Detectar nombre si lo menciona
    const nombreMatch = texto.match(/me llamo ([A-Za-záéíóúÁÉÍÓÚñÑ]+)/i) ||
                        texto.match(/soy ([A-Za-záéíóúÁÉÍÓÚñÑ]+)/i) ||
                        texto.match(/mi nombre es ([A-Za-záéíóúÁÉÍÓÚñÑ]+)/i)
    if (nombreMatch) {
      setContexto(prev => ({ ...prev, nombre: nombreMatch[1] }))
    }

    // Detectar especialidad por síntomas
    const especialidadDetectada = detectarEspecialidad(texto)
    if (especialidadDetectada && rol === 'paciente') {
      setSugerencia(especialidadDetectada)
      const sintomasActualizados = [...new Set([...contexto.sintomas, texto])]
      setContexto(prev => ({ ...prev, sintomas: sintomasActualizados }))
    }

    try {
      const historialParaAPI = nuevosMensajes.slice(-8)
      const respuesta = await preguntarAClaude(historialParaAPI, rol, contexto)
      setMensajes([...nuevosMensajes, { role: 'assistant', content: respuesta }])
    } catch {
      setMensajes([...nuevosMensajes, {
        role: 'assistant',
        content: 'Lo siento, hubo un error. Intenta de nuevo.',
      }])
    } finally {
      setCargando(false)
    }
  }

  const irAlEspecialista = () => {
    if (sugerencia) {
      navigate(`/buscar?especialidad=${encodeURIComponent(sugerencia.especialidad)}`)
      setAbierto(false)
      setSugerencia(null)
    }
  }

  const reiniciar = () => {
    setRol(null)
    setMensajes([])
    setInput('')
    setSugerencia(null)
    setContexto({ sintomas: [], nombre: null })
  }

  const formatearMensaje = (texto) => {
    return texto.split('\n').map((linea, i) => (
      <span key={i}>
        {linea}
        {i < texto.split('\n').length - 1 && <br />}
      </span>
    ))
  }

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="fixed bottom-6 right-6 bg-sky-500 text-white w-14 h-14 rounded-full shadow-xl text-2xl hover:bg-sky-600 transition z-50 flex items-center justify-center"
      >
        {abierto ? '✕' : '💬'}
      </button>

      {/* VENTANA DEL CHAT */}
      {abierto && (
        <div className="fixed bottom-24 right-6 w-84 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100" style={{ width: '340px', height: '520px' }}>

          {/* HEADER */}
          <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white px-4 py-3 flex justify-between items-center flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">🏥</div>
              <div>
                <p className="font-bold text-sm">Asistente Jelfen</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <p className="text-xs text-sky-100">{rol ? `Modo ${rol}` : 'En línea'}</p>
                </div>
              </div>
            </div>
            {rol && (
              <button onClick={reiniciar} className="text-xs text-sky-200 hover:text-white bg-white/10 px-2 py-1 rounded-lg">
                Reiniciar
              </button>
            )}
          </div>

          {/* SELECCIÓN DE ROL */}
          {!rol && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
              <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center text-4xl mb-2">🏥</div>
              <p className="text-gray-700 font-semibold text-center">¿Cómo puedo ayudarte hoy?</p>
              <p className="text-gray-400 text-xs text-center">Soy un asistente con IA que puede identificar síntomas y recomendarte el especialista ideal</p>
              <button onClick={() => elegirRol('paciente')} className="w-full bg-sky-50 border-2 border-sky-200 text-sky-700 py-3 rounded-xl font-medium hover:bg-sky-100 transition flex items-center justify-center gap-2">
                🏥 Soy Paciente
              </button>
              <button onClick={() => elegirRol('medico')} className="w-full bg-sky-500 text-white py-3 rounded-xl font-medium hover:bg-sky-600 transition flex items-center justify-center gap-2">
                👨‍⚕️ Soy Médico
              </button>
            </div>
          )}

          {/* MENSAJES */}
          {rol && (
            <>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50">
                {mensajes.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0 mt-1">J</div>
                    )}
                    <div className={`text-sm px-4 py-3 rounded-2xl max-w-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-sky-500 text-white rounded-br-sm'
                        : 'bg-white text-gray-700 shadow-sm rounded-bl-sm border border-gray-100'
                    }`}>
                      {formatearMensaje(msg.content)}
                    </div>
                  </div>
                ))}

                {/* Sugerencia de especialista */}
                {sugerencia && !cargando && (
                  <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-4 mx-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{sugerencia.emoji}</span>
                      <p className="font-bold text-gray-800 text-sm">Especialista detectado</p>
                    </div>
                    <p className="text-gray-600 text-xs mb-3">{sugerencia.descripcion}</p>
                    <button
                      onClick={irAlEspecialista}
                      className="w-full bg-sky-500 text-white py-2 rounded-xl text-xs font-semibold hover:bg-sky-600 transition flex items-center justify-center gap-2"
                    >
                      Ver {sugerencia.especialidad} disponibles →
                    </button>
                  </div>
                )}

                {cargando && (
                  <div className="flex justify-start">
                    <div className="w-7 h-7 bg-sky-500 rounded-full flex items-center justify-center text-white text-xs mr-2 flex-shrink-0">J</div>
                    <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1 items-center">
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* INPUT */}
              <div className="p-3 border-t border-gray-100 bg-white flex-shrink-0">
                {contexto.nombre && (
                  <p className="text-xs text-gray-400 mb-2 px-1">Hablando con: <span className="font-medium text-sky-500">{contexto.nombre}</span></p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
                    placeholder={rol === 'paciente' ? 'Describe tus síntomas...' : 'Escribe tu pregunta...'}
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-sky-400 bg-gray-50"
                  />
                  <button
                    onClick={enviarMensaje}
                    disabled={cargando || !input.trim()}
                    className="bg-sky-500 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-sky-600 disabled:opacity-40 transition flex-shrink-0"
                  >
                    ➤
                  </button>
                </div>
              </div>
            </>
          )}

        </div>
      )}
    </>
  )
}

export default ChatBot