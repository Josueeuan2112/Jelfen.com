import { createContext, useState } from 'react'
import { doctores } from '../utils/doctores'

export const AuthContext = createContext()

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(null)
  const [resenas, setResenas] = useState({})

  const getDoctorImagen = (id) => doctores.find(d => d.id === id)?.imagen || ''

  // Debe estar ANTES de calificarConsulta porque esta la llama
  const agregarResena = (doctorId, calificacion, comentario, autor) => {
    setResenas(prev => {
      const resenasDoctor = prev[doctorId] || []
      return {
        ...prev,
        [doctorId]: [
          {
            id: Date.now(),
            autor,
            calificacion,
            comentario,
            fecha: 'Ahora mismo',
            verificada: true,
          },
          ...resenasDoctor,
        ],
      }
    })
  }

  const [notificaciones, setNotificaciones] = useState([
  { id: 1, tipo: 'cita', titulo: 'Cita confirmada', mensaje: 'Tu cita con Dra. Elena Gómez el 15 de mayo a las 10:30 AM está confirmada.', fecha: 'Hace 2 horas', leida: false, icono: '📅' },
  { id: 2, tipo: 'recordatorio', titulo: 'Recordatorio de cita', mensaje: 'Mañana tienes consulta con Dr. Javier Ruiz a las 11:00 AM. No olvides tu identificación.', fecha: 'Hace 5 horas', leida: false, icono: '⏰' },
  { id: 3, tipo: 'mensaje', titulo: 'Mensaje de Dra. Elena Gómez', mensaje: 'Recuerda traer tus estudios previos y llegar 10 minutos antes de tu cita.', fecha: 'Ayer', leida: true, icono: '💬' },
  { id: 4, tipo: 'sistema', titulo: 'Bienvenido a Jelfen', mensaje: 'Tu cuenta ha sido creada exitosamente. Ya puedes agendar citas con médicos verificados.', fecha: 'Hace 3 días', leida: true, icono: '🏥' },
])

const [favoritos, setFavoritos] = useState([])

const toggleFavorito = (doctorId) => {
  setFavoritos(prev =>
    prev.includes(doctorId)
      ? prev.filter(id => id !== doctorId)
      : [...prev, doctorId]
  )
}

const esFavorito = (doctorId) => favoritos.includes(doctorId)

const getMedicosFrecuentes = () => {
  if (!usuario) return []

  // Cuenta cuántas veces aparece cada doctor en citas + historial
  const conteo = {}

  const registrar = (doctorId) => {
    if (!doctorId) return
    conteo[doctorId] = (conteo[doctorId] || 0) + 1
  }

  usuario.citas?.forEach(c => registrar(c.doctorId))
  usuario.historial?.forEach(h => registrar(h.doctorId))

  // Ordena por frecuencia y devuelve los datos completos del doctor
  return Object.entries(conteo)
    .sort((a, b) => b[1] - a[1])
    .map(([doctorId, visitas]) => ({
      doctor: doctores.find(d => d.id === parseInt(doctorId)),
      visitas,
    }))
    .filter(item => item.doctor)
}

const marcarLeida = (id) => {
  setNotificaciones(prev =>
    prev.map(n => n.id === id ? { ...n, leida: true } : n)
  )
}

const marcarTodasLeidas = () => {
  setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })))
}

const agregarNotificacion = (titulo, mensaje, tipo = 'sistema', icono = '🔔') => {
  setNotificaciones(prev => [{
    id: Date.now(),
    tipo, titulo, mensaje, icono,
    fecha: 'Ahora mismo',
    leida: false,
  }, ...prev])
}

  const login = (datos) => {
    setUsuario({
      ...datos,
      citas: [
        { id: 1, doctorId: 1, doctor: doctores.find(d => d.id === 1)?.nombre, especialidad: doctores.find(d => d.id === 1)?.especialidad, fecha: '2025-05-15', hora: '10:30 AM', tipo: 'Presencial', estado: 'confirmada', precio: doctores.find(d => d.id === 1)?.precio, imagen: getDoctorImagen(1), calificada: false },
        { id: 2, doctorId: 2, doctor: doctores.find(d => d.id === 2)?.nombre, especialidad: doctores.find(d => d.id === 2)?.especialidad, fecha: '2025-05-21', hora: '11:00 AM', tipo: 'Videoconsulta', estado: 'confirmada', precio: doctores.find(d => d.id === 2)?.precio, imagen: getDoctorImagen(2), calificada: false },
        { id: 3, doctorId: 3, doctor: doctores.find(d => d.id === 3)?.nombre, especialidad: doctores.find(d => d.id === 3)?.especialidad, fecha: '2025-05-27', hora: '09:00 AM', tipo: 'Videoconsulta', estado: 'pendiente', precio: doctores.find(d => d.id === 3)?.precio, imagen: getDoctorImagen(3), calificada: false },
      ],
      historial: [
        { id: 1, doctorId: 7, doctor: doctores.find(d => d.id === 7)?.nombre, especialidad: doctores.find(d => d.id === 7)?.especialidad, fecha: '2025-03-10', hora: '10:00 AM', tipo: 'Presencial', precio: doctores.find(d => d.id === 7)?.precio, imagen: getDoctorImagen(7), diagnostico: 'Migraña tensional crónica', notas: 'Se recomienda reducir el estrés y mantener horarios de sueño regulares. Evitar pantallas antes de dormir.', receta: ['Ibuprofeno 400mg — cada 8 hrs por 5 días', 'Magnesio 400mg — una vez al día por 30 días'], calificada: true, calificacion: 5, resena: 'Excelente doctor, muy atento y explicó todo con claridad.' },
        { id: 2, doctorId: 8, doctor: doctores.find(d => d.id === 8)?.nombre, especialidad: doctores.find(d => d.id === 8)?.especialidad, fecha: '2025-02-20', hora: '11:00 AM', tipo: 'Videoconsulta', precio: doctores.find(d => d.id === 8)?.precio, imagen: getDoctorImagen(8), diagnostico: 'Ansiedad generalizada leve', notas: 'Se inicia terapia cognitivo-conductual. Técnicas de respiración y mindfulness recomendadas.', receta: ['Terapia semanal por 8 semanas', 'Ejercicio aeróbico 30 min/día'], calificada: true, calificacion: 5, resena: 'Me ayudó muchísimo. La recomiendo ampliamente.' },
        { id: 3, doctorId: 1, doctor: doctores.find(d => d.id === 1)?.nombre, especialidad: doctores.find(d => d.id === 1)?.especialidad, fecha: '2025-01-15', hora: '09:30 AM', tipo: 'Presencial', precio: doctores.find(d => d.id === 1)?.precio, imagen: getDoctorImagen(1), diagnostico: 'Infección respiratoria alta', notas: 'Reposo relativo, hidratación constante. Control en 7 días si persisten síntomas.', receta: ['Amoxicilina 500mg — cada 8 hrs por 7 días', 'Paracetamol 500mg — cada 6 hrs si hay fiebre'], calificada: false, calificacion: null, resena: null },
      ],
    })
  }

  const logout = () => setUsuario(null)

  const calificarConsulta = (historialId, calificacion, resena) => {
    setUsuario(prev => {
      const consulta = prev.historial.find(h => h.id === historialId)

      if (resena && consulta?.doctorId) {
        agregarResena(
          consulta.doctorId,
          calificacion,
          resena,
          prev.nombre || 'Paciente verificado'
        )
      }

      return {
        ...prev,
        historial: prev.historial.map(h =>
          h.id === historialId
            ? { ...h, calificada: true, calificacion, resena }
            : h
        ),
      }
    })
  }

  const agregarCita = (doctor, tipo, fecha, hora) => {
    setUsuario(prev => {
      const nuevaId = Math.max(...prev.citas.map(c => c.id), 0) + 1

      const agregarCita = (doctor, tipo, fecha, hora) => {
    setUsuario(prev => {
      const nuevaId = Math.max(...prev.citas.map(c => c.id), 0) + 1
    return {
      ...prev,
      citas: [...prev.citas, {
        id: nuevaId,
        doctorId: doctor.id,
        doctor: doctor.nombre,
        especialidad: doctor.especialidad,
        fecha, hora, tipo,
        estado: 'confirmada',
        precio: doctor.precio,
        imagen: doctor.imagen,
        calificada: false,
      }],
    }
  })

  // Genera notificación automática
   agregarNotificacion(
    'Cita confirmada',
    `Tu cita con ${doctor.nombre} el ${new Date(fecha + 'T12:00:00').toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })} a las ${hora} ha sido confirmada.`,
    'cita',
    '📅'
   )
  }

      return {
        ...prev,
        citas: [...prev.citas, {
          id: nuevaId,
          doctorId: doctor.id,
          doctor: doctor.nombre,
          especialidad: doctor.especialidad,
          fecha,
          hora,
          tipo,
          estado: 'confirmada',
          precio: doctor.precio,
          imagen: doctor.imagen,
          calificada: false,
        }],
      }
    })
  }

  const cancelarCita = (citaId) => {
    setUsuario(prev => ({
      ...prev,
      citas: prev.citas.map(c =>
        c.id === citaId ? { ...c, estado: 'cancelada' } : c
      ),
    }))
  }

  const reprogramarCita = (citaId, nuevaFecha, nuevaHora) => {
    setUsuario(prev => ({
      ...prev,
      citas: prev.citas.map(c =>
        c.id === citaId ? { ...c, fecha: nuevaFecha, hora: nuevaHora, estado: 'confirmada' } : c
      ),
    }))
  }

  return (
    <AuthContext.Provider value={{
      usuario, login, logout,
      calificarConsulta, agregarCita,
      cancelarCita, reprogramarCita,
      resenas, agregarResena,
      notificaciones, marcarLeida, marcarTodasLeidas, agregarNotificacion,
      favoritos, toggleFavorito, esFavorito, getMedicosFrecuentes
    }}>
      {children}
    </AuthContext.Provider>
  )
}