import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-12 pb-6 px-6 mt-auto">
      <div className="max-w-5xl mx-auto">

        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">

          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white mb-3 block">
              🏥 Jelfen
            </Link>
            <p className="text-sm leading-relaxed mb-4">
              Conectamos pacientes con médicos verificados en México. Tu salud en buenas manos, estés donde estés.
            </p>
            <div className="flex gap-3">
              <span className="bg-gray-800 text-xs px-3 py-1 rounded-full">✅ Médicos verificados SEP</span>
              <span className="bg-gray-800 text-xs px-3 py-1 rounded-full">🔒 Pagos seguros</span>
            </div>
          </div>

          {/* Links para pacientes */}
          <div>
            <h4 className="text-white font-semibold mb-4">Pacientes</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/buscar" className="hover:text-white transition">Buscar Doctor</Link></li>
              <li><Link to="/buscar" className="hover:text-white transition">Especialidades</Link></li>
              <li><Link to="/buscar" className="hover:text-white transition">Videoconsultas</Link></li>
              <li><Link to="/" className="hover:text-white transition">¿Cómo funciona?</Link></li>
            </ul>
          </div>

          {/* Links para médicos */}
          <div>
            <h4 className="text-white font-semibold mb-4">Médicos</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link to="/registro" className="hover:text-white transition">Únete a Jelfen</Link></li>
              <li><Link to="/registro" className="hover:text-white transition">Cómo funciona</Link></li>
              <li><Link to="/registro" className="hover:text-white transition">Comisiones</Link></li>
              <li><Link to="/registro" className="hover:text-white transition">Preguntas frecuentes</Link></li>
            </ul>
          </div>

        </div>

        {/* Línea divisora */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2025 Jelfen. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Términos y condiciones</a>
            <a href="#" className="hover:text-white transition">Privacidad</a>
            <a href="#" className="hover:text-white transition">Contacto</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer