import { useState } from 'react'

// --- BARRA DE PROGRESO ---
function BarraProgreso({ pasoActual, totalPasos }) {
  const porcentaje = (pasoActual / totalPasos) * 100

  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Paso {pasoActual} de {totalPasos}</span>
        <span>{Math.round(porcentaje)}% completado</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-sky-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${porcentaje}%` }}
        />
      </div>
    </div>
  )
}

// --- PASO 1: CUENTA BÁSICA ---
function PasoCuenta({ datos, setDatos }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Crea tu cuenta</h2>
      <p className="text-gray-500 mb-6">Ingresa tus datos básicos para comenzar</p>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={datos.nombre}
          onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={datos.correo}
          onChange={(e) => setDatos({ ...datos, correo: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={datos.contrasena}
          onChange={(e) => setDatos({ ...datos, contrasena: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400"
        />
        <input
          type="tel"
          placeholder="Número de teléfono"
          value={datos.telefono}
          onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400"
        />
      </div>
    </div>
  )
}

// --- PASO 2: DATOS PERSONALES ---
function PasoDatosPersonales({ datos, setDatos }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Datos personales</h2>
      <p className="text-gray-500 mb-6">Necesitamos verificar tu identidad</p>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="CURP"
          value={datos.curp}
          onChange={(e) => setDatos({ ...datos, curp: e.target.value.toUpperCase() })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 uppercase"
          maxLength={18}
        />
        <input
          type="text"
          placeholder="RFC"
          value={datos.rfc}
          onChange={(e) => setDatos({ ...datos, rfc: e.target.value.toUpperCase() })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400"
          maxLength={13}
        />
        <input
          type="date"
          value={datos.fechaNacimiento}
          onChange={(e) => setDatos({ ...datos, fechaNacimiento: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-gray-600"
        />
        <select
          value={datos.genero}
          onChange={(e) => setDatos({ ...datos, genero: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-gray-600"
        >
          <option value="">Selecciona género</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Prefiero no decir</option>
        </select>
      </div>
    </div>
  )
}

// --- PASO 3: DOCUMENTOS ---
function PasoDocumentos({ datos, setDatos }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Documentos profesionales</h2>
      <p className="text-gray-500 mb-6">Sube tus documentos en PDF o imagen (máx. 10MB)</p>

      <div className="flex flex-col gap-4">
        {[
          { label: '📄 Título profesional', key: 'titulo' },
          { label: '🏛️ Cédula Profesional SEP', key: 'cedula' },
          { label: '🔬 Certificado de especialidad (opcional)', key: 'especialidad' },
        ].map((doc) => (
          <div key={doc.key} className="border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-sky-300 transition">
            <label className="flex flex-col items-center cursor-pointer gap-2">
              <span className="text-gray-600 font-medium">{doc.label}</span>
              <span className="text-xs text-gray-400">
                {datos[doc.key] ? `✅ ${datos[doc.key].name}` : 'Haz clic para subir archivo'}
              </span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => setDatos({ ...datos, [doc.key]: e.target.files[0] })}
              />
            </label>
          </div>
        ))}

        <div className="bg-sky-50 rounded-xl p-4 text-sm text-sky-700">
          💡 Tu cédula será verificada automáticamente con la base de datos de la SEP
        </div>
      </div>
    </div>
  )
}

// --- PASO 4: PERFIL PÚBLICO ---
function PasoPerfil({ datos, setDatos }) {
  const servicios = ['Consulta general', 'Videoconsulta', 'Urgencias', 'Seguimiento', 'Pediatría', 'Dermatología']

  const toggleServicio = (servicio) => {
    const lista = datos.servicios || []
    if (lista.includes(servicio)) {
      setDatos({ ...datos, servicios: lista.filter((s) => s !== servicio) })
    } else {
      setDatos({ ...datos, servicios: [...lista, servicio] })
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Tu perfil público</h2>
      <p className="text-gray-500 mb-6">Esto es lo que verán los pacientes</p>

      <div className="flex flex-col gap-4">
        <textarea
          placeholder="Biografía profesional (máx. 300 palabras)"
          value={datos.biografia}
          onChange={(e) => setDatos({ ...datos, biografia: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 resize-none h-28"
          maxLength={1500}
        />

        <select
          value={datos.modalidad}
          onChange={(e) => setDatos({ ...datos, modalidad: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400 text-gray-600"
        >
          <option value="">Modalidad de atención</option>
          <option value="presencial">Presencial</option>
          <option value="videoconsulta">Videoconsulta</option>
          <option value="ambas">Ambas</option>
        </select>

        <div>
          <p className="text-gray-600 font-medium mb-2">Servicios que ofreces:</p>
          <div className="flex flex-wrap gap-2">
            {servicios.map((servicio) => (
              <button
                key={servicio}
                onClick={() => toggleServicio(servicio)}
                className={`px-4 py-2 rounded-full text-sm border transition ${
                  (datos.servicios || []).includes(servicio)
                    ? 'bg-sky-500 text-white border-sky-500'
                    : 'border-gray-200 text-gray-600 hover:border-sky-300'
                }`}
              >
                {servicio}
              </button>
            ))}
          </div>
        </div>

        <input
          type="number"
          placeholder="Precio de consulta general (MXN)"
          value={datos.precio}
          onChange={(e) => setDatos({ ...datos, precio: e.target.value })}
          className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-sky-400"
        />

        <div className="bg-sky-50 rounded-xl p-4 text-sm text-sky-700">
          💡 El promedio en Mérida para médicos generales es de $200 — $400 MXN
        </div>
      </div>
    </div>
  )
}

// --- PASO 5: CONFIRMACIÓN ---
function PasoConfirmacion() {
  return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Solicitud enviada!</h2>
      <p className="text-gray-500 mb-4">
        Tu información está siendo revisada por el equipo de Jelfen.
      </p>
      <div className="bg-sky-50 rounded-xl p-4 text-left text-sm text-sky-700 mb-4">
        <p className="font-semibold mb-2">¿Qué sigue?</p>
        <p>✅ Verificación de cédula ante la SEP — automática</p>
        <p>👁️ Revisión humana de documentos — máx. 48 hrs hábiles</p>
        <p>📧 Te notificaremos por correo cuando tu perfil esté activo</p>
      </div>
    </div>
  )
}

// --- PÁGINA COMPLETA ---
function DoctorRegister() {
  const [paso, setPaso] = useState(1)
  const totalPasos = 5

  const [datos, setDatos] = useState({
    nombre: '', correo: '', contrasena: '', telefono: '',
    curp: '', rfc: '', fechaNacimiento: '', genero: '',
    titulo: null, cedula: null, especialidad: null,
    biografia: '', modalidad: '', servicios: [], precio: '',
  })

  const pasos = {
    1: <PasoCuenta datos={datos} setDatos={setDatos} />,
    2: <PasoDatosPersonales datos={datos} setDatos={setDatos} />,
    3: <PasoDocumentos datos={datos} setDatos={setDatos} />,
    4: <PasoPerfil datos={datos} setDatos={setDatos} />,
    5: <PasoConfirmacion />,
  }

  return (
    <div className="min-h-screen bg-sky-50 px-6 py-10">
      <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-sm p-8">

        <div className="text-center mb-6">
          <span className="text-sky-500 font-semibold text-sm uppercase tracking-wide">
            Registro de Médico
          </span>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">Únete a Jelfen</h1>
        </div>

        <BarraProgreso pasoActual={paso} totalPasos={totalPasos} />

        {pasos[paso]}

        {/* Botones de navegación */}
        <div className="flex gap-3 mt-8">
          {paso > 1 && paso < 5 && (
            <button
              onClick={() => setPaso(paso - 1)}
              className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl hover:bg-gray-50 font-medium"
            >
              ← Atrás
            </button>
          )}
          {paso < 4 && (
            <button
              onClick={() => setPaso(paso + 1)}
              className="flex-1 bg-sky-500 text-white py-3 rounded-xl hover:bg-sky-600 font-medium"
            >
              Continuar →
            </button>
          )}
          {paso === 4 && (
            <button
              onClick={() => setPaso(5)}
              className="flex-1 bg-sky-500 text-white py-3 rounded-xl hover:bg-sky-600 font-medium"
            >
              Enviar solicitud ✅
            </button>
          )}
        </div>

      </div>
    </div>
  )
}

export default DoctorRegister