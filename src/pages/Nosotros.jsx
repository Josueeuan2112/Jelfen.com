import { Link } from 'react-router-dom'

// --- PÁGINA DE PRINCIPAL ---

// --- HERO ---
function HeroNosotros() {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] flex items-center overflow-hidden">
      <img src="/nosotros-doctors.png" alt="Equipo médico Jelfen" className="absolute inset-0 w-full h-full object-cover object-center" />
      <div className="absolute inset-0 bg-white/70 md:bg-transparent" />

      <div className="relative z-10 w-full px-4 md:px-0 md:ml-10 lg:ml-20 py-10 md:py-24 md:max-w-lg">
        <div className="bg-white/90 md:bg-transparent backdrop-blur-md md:backdrop-blur-none rounded-3xl md:rounded-none p-6 md:p-0 shadow-xl md:shadow-none">
          <span className="bg-sky-100 text-sky-600 text-xs font-bold px-3 py-1.5 rounded-full tracking-widest uppercase mb-4 inline-block">
            Sobre Jelfen
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            La plataforma médica que México <span className="text-sky-500">necesitaba</span>
          </h1>
          <p className="text-gray-500 text-base md:text-lg mb-6 leading-relaxed">
            Nacimos para resolver un problema real: conectar pacientes con médicos confiables, verificados y accesibles.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/doctores" className="bg-sky-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-sky-600 shadow-md transition text-sm">
              Encontrar un Doctor
            </Link>
            <Link to="/registro" className="border-2 border-sky-500 text-sky-500 px-6 py-3 rounded-full font-semibold hover:bg-sky-100 transition text-sm">
              Soy Médico
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// --- ESTADÍSTICAS ---
function Estadisticas() {
  const stats = [
    { numero: '500+', label: 'Médicos verificados' },
    { numero: '12,000+', label: 'Pacientes atendidos' },
    { numero: '98%', label: 'Satisfacción' },
    { numero: '48 hrs', label: 'Verificación máx.' },
  ]
  return (
    <section className="bg-sky-50 py-10 md:py-16 px-4 md:px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-sky-500 mb-1">{stat.numero}</p>
            <p className="text-gray-500 text-xs md:text-sm">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// --- PROBLEMA Y SOLUCIÓN ---
function ProblemaYSolucion() {
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 bg-sky-50">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
        <div>
          <span className="text-red-400 font-bold text-xs uppercase tracking-widest">El problema</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-5">Buscar un médico confiable no debería ser tan difícil</h2>
          <div className="flex flex-col gap-3">
            {['Horas esperando en salas llenas', 'No saber si el médico está certificado', 'Precios ocultos al final', 'Imposible encontrar especialistas fuera de tu ciudad', 'Plataformas sin validación real'].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-red-400 text-lg mt-0.5 flex-shrink-0">✗</span>
                <p className="text-gray-600 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <span className="text-green-500 font-bold text-xs uppercase tracking-widest">La solución Jelfen</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2 mb-5">Salud de calidad, verificada y accesible desde tu celular</h2>
          <div className="flex flex-col gap-3">
            {['Agenda en minutos, sin filas', 'Cada médico verificado con la SEP', 'Precios transparentes desde el primer clic', 'Videoconsultas a todo México', 'Solo médicos con cédula activa validada'].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-green-500 text-lg mt-0.5 flex-shrink-0">✓</span>
                <p className="text-gray-600 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// --- CÓMO FUNCIONA ---
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
    <section className="py-16 px-6 bg-sky-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">¿Cómo funciona Jelfen?</h2>
          <p className="text-gray-500">Agenda tu consulta en menos de 3 minutos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {pasos.map((paso, index) => (
            <div key={index} className="relative flex flex-col items-center text-center">
              {index < pasos.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-sky-100 z-0" />
              )}
              <div className="relative z-10 w-16 h-16 bg-sky-500 text-white rounded-full flex items-center justify-center text-2xl mb-4 shadow-md">
                {paso.icono}
              </div>
              <span className="text-xs font-bold text-sky-400 tracking-widest mb-1">PASO {paso.numero}</span>
              <h3 className="font-bold text-gray-800 mb-2">{paso.titulo}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{paso.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- VERIFICACIÓN SEP ---
function VerificacionSEP() {
  return (
    <section className="py-16 px-6 bg-sky-50">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">

        <div className="flex-1">
          <span className="text-sky-500 font-bold text-sm uppercase tracking-widest">Nuestro diferenciador</span>
          <h2 className="text-3xl font-bold text-gray-800 mt-2 mb-4">
            El único sistema de verificación médica en tiempo real con la SEP
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            A diferencia de otras plataformas donde cualquiera puede registrarse como médico, en Jelfen cada doctor pasa por un proceso de validación riguroso antes de aparecer en la plataforma.
          </p>
          <div className="flex flex-col gap-3">
            {[
              { icono: '🤖', texto: 'Verificación automática de cédula ante el SIICPC de la SEP' },
              { icono: '👁️', texto: 'Revisión humana de documentos por nuestro equipo interno' },
              { icono: '🔵', texto: 'Badge de Especialista Verificado para médicos con especialidad certificada' },
              { icono: '🔄', texto: 'Renovación anual obligatoria para mantener el perfil activo' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm">
                <span className="text-2xl">{item.icono}</span>
                <p className="text-gray-600 text-sm">{item.texto}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h3 className="font-bold text-gray-800 text-xl mb-2">Verificado ante la SEP</h3>
          <p className="text-gray-500 text-sm mb-6">
            Consultamos el Sistema Institucional de Información de Cédulas Profesionales en tiempo real con cada registro.
          </p>
          <div className="flex flex-col gap-3 text-left">
            <div className="flex items-center gap-3 bg-green-50 rounded-xl p-3">
              <span className="text-green-500 font-bold">✅</span>
              <p className="text-green-700 text-sm font-medium">Cédula Profesional activa</p>
            </div>
            <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-3">
              <span className="text-blue-500 font-bold">🔵</span>
              <p className="text-blue-700 text-sm font-medium">Especialidad certificada y verificada</p>
            </div>
            <div className="flex items-center gap-3 bg-sky-50 rounded-xl p-3">
              <span className="text-sky-500 font-bold">📋</span>
              <p className="text-sky-700 text-sm font-medium">Documentos revisados por humanos</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

// --- VALORES ---
function Valores() {
  const valores = [
    { icono: '🤝', titulo: 'Confianza', descripcion: 'Cada médico es verificado antes de publicarse.' },
    { icono: '💡', titulo: 'Transparencia', descripcion: 'Sin costos ocultos ni suscripciones forzadas.' },
    { icono: '🌍', titulo: 'Accesibilidad', descripcion: 'Videoconsultas llevan salud a todo México.' },
    { icono: '⚡', titulo: 'Eficiencia', descripcion: 'Agenda en minutos, sin esperas innecesarias.' },
  ]
  return (
    <section className="py-10 md:py-16 px-4 md:px-6 bg-sky-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Nuestros valores</h2>
          <p className="text-gray-500 text-sm">Lo que nos guía en cada decisión</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {valores.map((valor, i) => (
            <div key={i} className="border border-gray-100 rounded-2xl p-4 md:p-6 hover:shadow-md transition text-center">
              <div className="text-3xl md:text-4xl mb-3">{valor.icono}</div>
              <h3 className="font-bold text-gray-800 mb-1 text-sm md:text-base">{valor.titulo}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{valor.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// --- CTA FINAL ---
function CTAFinal() {
  return (
    <section className="bg-sky-50 py-20 px-6 text-center text-gray-600">
      <h2 className="text-4xl font-bold mb-4">¿Listo para cuidar tu salud?</h2>
      <p className="text-gray-500 text-xl mb-8 max-w-xl mx-auto">
        Únete a miles de pacientes que ya confían en Jelfen para encontrar el médico ideal.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <Link
          to="/buscar"
          className="bg-sky-500 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-sky-600 transition"
        >
          Encontrar un Doctor
        </Link>
        <Link
          to="/registro"
          className="border-2 border-gray-300 text-gray-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-white/10 transition"
        >
          Soy Médico — Únete gratis
        </Link>
      </div>
    </section>
  )
}

// --- PÁGINA COMPLETA ---
function Nosotros() {
  return (
    <div>
      <HeroNosotros />
      <Estadisticas />
      <ProblemaYSolucion />
      <ComoFunciona />
      <VerificacionSEP />
      <Valores />
      <CTAFinal />
    </div>
  )
}

export default Nosotros