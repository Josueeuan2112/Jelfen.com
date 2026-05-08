import { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const { usuario, notificaciones } = useAuth()
  const location  = useLocation()
  const navigate  = useNavigate()
  const noLeidas  = notificaciones?.filter(n => !n.leida).length || 0

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const links = [
    { to: '/',         label: 'Principal',  num: '01' },
    { to: '/doctores', label: 'Doctores',   num: '02' },
    { to: '/contacto', label: 'Contáctanos', num: '04' },
  ]

  return (
    <>
      {/* ── NAVBAR FIJA ── */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          flex items-center justify-between
          px-5 sm:px-10 lg:px-20
          h-16 md:h-20
          transition-all duration-500
          ${scrolled || menuOpen
            ? 'bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm'
            : 'bg-transparent'
          }
        `}
      >
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-2.5 z-10"
          onClick={() => setMenuOpen(false)}
        >
          <span className="font-bold text-sky-500 text-base sm:text-lg tracking-wide">
            Jel<span className="text-sky-500">fen</span>
          </span>
        </NavLink>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8">
          {links.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `
                  text-xs lg:text-sm font-medium tracking-wide
                  transition-colors duration-200 relative group
                  ${isActive ? 'text-sky-500' : 'text-gray-500 hover:text-gray-800'}
                `}
              >
                {({ isActive }) => (
                  <>
                    {label}
                    <span className={`
                      absolute -bottom-1 left-0 h-px bg-sky-500
                      transition-all duration-300
                      ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}
                    `} />
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Botones derecha — desktop */}
        <div className="hidden md:flex items-center gap-3">
          <NavLink
            to="/registro"
            className="text-xs font-medium text-sky-500 border border-sky-400 px-4 py-2 rounded-full hover:bg-sky-50 transition-colors duration-200"
          >
            Soy Médico
          </NavLink>

          {usuario ? (
            <div className="flex items-center gap-2">
              {/* Campana */}
              <button
                onClick={() => navigate('/dashboard')}
                className="relative w-9 h-9 rounded-full bg-sky-50 hover:bg-sky-100 flex items-center justify-center transition"
              >
                <BellIcon />
                {noLeidas > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                    {noLeidas > 9 ? '9+' : noLeidas}
                  </span>
                )}
              </button>
              {/* Avatar */}
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 bg-sky-500 text-white pl-2 pr-4 py-1.5 rounded-full hover:bg-sky-600 transition text-sm font-medium"
              >
                <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                  {usuario.avatar}
                </div>
                {usuario.nombre.split(' ')[0]}
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 text-xs font-medium bg-sky-500 text-white px-4 py-2 rounded-full hover:bg-sky-600 transition-colors duration-200"
            >
              Iniciar Sesión
              <ArrowIcon />
            </button>
          )}
        </div>

        {/* Hamburguesa — mobile */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="md:hidden z-10 flex flex-col justify-center gap-[5px] w-10 h-10 -mr-1"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          <span className={`
            block h-px bg-gray-800 origin-center
            transition-all duration-400 ease-in-out
            ${menuOpen ? 'w-6 rotate-45 translate-y-[6px]' : 'w-6'}
          `} />
          <span className={`
            block h-px bg-gray-800
            transition-all duration-400 ease-in-out
            ${menuOpen ? 'w-0 opacity-0' : 'w-4 opacity-100'}
          `} />
          <span className={`
            block h-px bg-gray-800 origin-center
            transition-all duration-400 ease-in-out
            ${menuOpen ? 'w-6 -rotate-45 -translate-y-[6px]' : 'w-6'}
          `} />
        </button>
      </nav>

      {/* ── MENÚ MOBILE — pantalla completa ── */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          flex flex-col justify-between
          px-5 pt-24 pb-10
          bg-white
          transition-all duration-500 ease-in-out
          ${menuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
          }
        `}
      >
        {/* Links */}
        <ul className="flex flex-col gap-1">
          {links.map(({ to, label, num }, i) => (
            <li
              key={to}
              className="border-b border-sky-100 overflow-hidden"
            >
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) => `
                  flex items-center justify-between py-5 group
                  transition-all duration-300
                  ${isActive ? 'text-sky-500' : 'text-gray-800'}
                `}
                style={{
                  transform:  menuOpen ? 'translateY(0)'    : 'translateY(100%)',
                  opacity:    menuOpen ? 1                   : 0,
                  transition: `transform 0.5s ease ${i * 60}ms, opacity 0.5s ease ${i * 60}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-xs font-mono">{num}</span>
                  <span className="text-3xl sm:text-4xl font-light tracking-tight group-hover:text-sky-500 transition-colors duration-200">
                    {label}
                  </span>
                </div>
                <span className="text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -rotate-45">
                  <ArrowIcon size={20} />
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer del menú mobile */}
        <div
          className="flex flex-col gap-4"
          style={{
            transform:  menuOpen ? 'translateY(0)'    : 'translateY(20px)',
            opacity:    menuOpen ? 1                   : 0,
            transition: `transform 0.5s ease 380ms, opacity 0.5s ease 380ms`,
          }}
        >
          <NavLink
            to="/registro"
            className="w-full text-center py-4 text-sm font-semibold border-2 border-sky-500 text-sky-500 rounded-2xl hover:bg-sky-50 transition"
          >
            Soy Médico
          </NavLink>

          {usuario ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 text-sm font-semibold bg-sky-500 text-white rounded-2xl hover:bg-sky-600 transition flex items-center justify-center gap-2"
            >
              <div className="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs font-bold">
                {usuario.avatar}
              </div>
              Mi Cuenta — {usuario.nombre.split(' ')[0]}
              {noLeidas > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{noLeidas}</span>
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 text-sm font-semibold bg-sky-500 text-white rounded-2xl hover:bg-sky-600 transition flex items-center justify-center gap-2"
            >
              Iniciar Sesión
              <ArrowIcon />
            </button>
          )}

          <p className="text-gray-400 text-xs text-center">Jelfen · Mérida, Yucatán, MX</p>
        </div>
      </div>
    </>
  )
}

/* ── Íconos ── */

function ArrowIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
      <path
        d="M2 7h10M8 3l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}