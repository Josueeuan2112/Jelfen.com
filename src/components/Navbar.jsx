import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-sky-50 shadow-sm px-6 py-4 flex items-center justify-between">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold text-sky-500">
        🏥 Jelfen
      </Link>

      {/* Links del centro */}
      <div className="flex gap-6 text-gray-600 font-medium">
        <Link to="/" className="hover:text-sky-500">Principal</Link>
        <Link to="/doctores" className="hover:text-sky-500">Doctores</Link>

      </div>

      {/* Botones de la derecha */}
      <div className="flex gap-3">
        <Link to="/registro" className="border border-sky-500 text-sky-500 px-4 py-2 rounded-full hover:bg-sky-50 font-medium">
          Soy Médico
        </Link>
        <Link to="/buscar" className="bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 font-medium">
          Iniciar Sesión
        </Link>
      </div>

    </nav>
  )
}

//en la linea 15 debe ir el navbar de buscar doctores pero lo oculte para que se vea en el hero de doctores
 //       <Link to="/buscar" className="hover:text-sky-500">Buscar Doctor</Link>
export default Navbar