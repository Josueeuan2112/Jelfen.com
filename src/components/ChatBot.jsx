import { useState } from 'react'
import { preguntarAClaude } from '../utils/api'

function ChatBot() {
  const [abierto, setAbierto] = useState(false)
  const [rol, setRol] = useState(null) // 'paciente' o 'medico'
  const [mensajes, setMensajes] = useState([])
  const [input, setInput] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviarMensaje = async () => {
    if (!input.trim() || cargando) return

    const nuevosMensajes = [...mensajes, { role: 'user', content: input }]
    setMensajes(nuevosMensajes)
    setInput('')
    setCargando(true)

    try {
      const respuesta = await preguntarAClaude(nuevosMensajes, rol)
      setMensajes([...nuevosMensajes, { role: 'assistant', content: respuesta }])
    } catch (error) {
      setMensajes([...nuevosMensajes, {
        role: 'assistant',
        content: 'Lo siento, hubo un error. Intenta de nuevo.',
      }])
    } finally {
      setCargando(false)
    }
  }

  const elegirRol = (rolElegido) => {
    setRol(rolElegido)
    const bienvenida = rolElegido === 'paciente'
      ? '¡Hola! Soy tu asistente en Jelfen 👋 ¿En qué puedo ayudarte? Puedo ayudarte a encontrar un doctor o resolver dudas sobre tus citas.'
      : '¡Bienvenido médico! 👨‍⚕️ Puedo ayudarte con el proceso de registro, verificación de cédula o cualquier duda sobre la plataforma.'
    setMensajes([{ role: 'assistant', content: bienvenida }])
  }

  const reiniciar = () => {
    setRol(null)
    setMensajes([])
    setInput('')
  }

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setAbierto(!abierto)}
        className="fixed bottom-6 right-6 bg-sky-500 text-white w-14 h-14 rounded-full shadow-lg text-2xl hover:bg-sky-600 transition z-50"
      >
        {abierto ? '✕' : '💬'}
      </button>

      {/* VENTANA DEL CHAT */}
      {abierto && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden" style={{ height: '480px' }}>

          {/* HEADER */}
          <div className="bg-sky-500 text-white px-4 py-3 flex justify-between items-center">
            <div>
              <p className="font-bold">Asistente Jelfen</p>
              <p className="text-xs text-sky-100">
                {rol ? `Modo: ${rol}` : 'Selecciona tu rol'}
              </p>
            </div>
            {rol && (
              <button onClick={reiniciar} className="text-xs text-sky-200 hover:text-white">
                Cambiar rol
              </button>
            )}
          </div>

          {/* SELECCIÓN DE ROL */}
          {!rol && (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
              <p className="text-gray-600 font-medium text-center">¿Cómo puedo ayudarte hoy?</p>
              <button
                onClick={() => elegirRol('paciente')}
                className="w-full bg-sky-50 border border-sky-200 text-sky-700 py-3 rounded-xl font-medium hover:bg-sky-100 transition"
              >
                🏥 Soy Paciente
              </button>
              <button
                onClick={() => elegirRol('medico')}
                className="w-full bg-sky-500 text-white py-3 rounded-xl font-medium hover:bg-sky-600 transition"
              >
                👨‍⚕️ Soy Médico
              </button>
            </div>
          )}

          {/* MENSAJES */}
          {rol && (
            <>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {mensajes.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-sm px-4 py-3 rounded-2xl max-w-xs ${
                      msg.role === 'user'
                        ? 'bg-sky-500 text-white self-end rounded-br-sm'
                        : 'bg-gray-100 text-gray-700 self-start rounded-bl-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {cargando && (
                  <div className="bg-gray-100 text-gray-500 text-sm px-4 py-3 rounded-2xl self-start">
                    Escribiendo...
                  </div>
                )}
              </div>

              {/* INPUT */}
              <div className="p-3 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && enviarMensaje()}
                  placeholder="Escribe tu pregunta..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-sky-400"
                />
                <button
                  onClick={enviarMensaje}
                  disabled={cargando}
                  className="bg-sky-500 text-white w-9 h-9 rounded-full flex items-center justify-center hover:bg-sky-600 disabled:opacity-50"
                >
                  ➤
                </button>
              </div>
            </>
          )}

        </div>
      )}
    </>
  )
}

export default ChatBot