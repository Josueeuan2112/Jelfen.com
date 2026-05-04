import { Link } from 'react-router-dom'

function Footer() {
  return (
  <footer className="bg-gray-900 text-gray-400 pt-10 pb-6 px-4 md:px-6 mt-auto">
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
        <div className="col-span-2 md:col-span-2">
          <Link to="/" className="text-xl font-bold text-white mb-3 block">🏥 Jelfen</Link>
          <p className="text-sm leading-relaxed mb-4">
            Conectamos pacientes con médicos verificados en México.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-gray-800 text-xs px-3 py-1 rounded-full">✅ Verificados SEP</span>
            <span className="bg-gray-800 text-xs px-3 py-1 rounded-full">🔒 Pagos seguros</span>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Pacientes</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link to="/buscar" className="hover:text-white transition text-xs">Buscar Doctor</Link></li>
            <li><Link to="/buscar" className="hover:text-white transition text-xs">Videoconsultas</Link></li>
            <li><Link to="/nosotros" className="hover:text-white transition text-xs">¿Cómo funciona?</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm">Médicos</h4>
          <ul className="flex flex-col gap-2 text-sm">
            <li><Link to="/registro" className="hover:text-white transition text-xs">Únete a Jelfen</Link></li>
            <li><Link to="/registro" className="hover:text-white transition text-xs">Comisiones</Link></li>
            <li><Link to="/contacto" className="hover:text-white transition text-xs">Contacto</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
        <p>© 2025 Jelfen. Todos los derechos reservados.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition">Términos</a>
          <a href="#" className="hover:text-white transition">Privacidad</a>
          <Link to="/contacto" className="hover:text-white transition">Contacto</Link>
        </div>
      </div>
    </div>
  </footer>
)
}

export default Footer