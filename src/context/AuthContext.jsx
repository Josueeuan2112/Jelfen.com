import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)

  const login = (datos) => setUsuario({
    ...datos,
    citas: [
      { id: 1, doctor: 'Dra. Elena Gómez', especialidad: 'Pediatría', fecha: '2025-05-15', hora: '10:30 AM', tipo: 'Presencial', estado: 'confirmada', precio: 350, imagen: 'https://img.freepik.com/fotos-premium/confiado-mi-capacidad-medica-retrato-recortado-atractiva-joven-doctora-pie-brazos-cruzados-oficina_590464-2228.jpg?semt=ais_hybrid&w=740&q=80', calificada: false },
      { id: 2, doctor: 'Dr. Javier Ruiz', especialidad: 'Cardiología', fecha: '2025-05-21', hora: '11:00 AM', tipo: 'Videoconsulta', estado: 'confirmada', precio: 600, imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaREUcGfItcCTS2gdvXi15C2Xgkhao2-c-iAcyStkQsEO6vOHKZJznbhc&s', calificada: false },
      { id: 3, doctor: 'Dra. Sofía Morales', especialidad: 'Medicina General', fecha: '2025-05-27', hora: '09:00 AM', tipo: 'Videoconsulta', estado: 'pendiente', precio: 250, imagen: 'https://media.gettyimages.com/id/1916997079/es/foto/confident-female-doctor-with-arms-crossed-against-white-background.jpg?s=612x612&w=0&k=20&c=F8QOoeN2qbhsJ21MjQ5dL_4k2dRp5CW-jscJrrvEw2I=', calificada: false },
    ],
    historial: [
      {
        id: 1,
        doctor: 'Dr. Andrés Castillo',
        especialidad: 'Neurología',
        fecha: '2025-03-10',
        hora: '10:00 AM',
        tipo: 'Presencial',
        precio: 700,
        imagen: 'https://randomuser.me/api/portraits/men/22.jpg',
        diagnostico: 'Migraña tensional crónica',
        notas: 'Se recomienda reducir el estrés y mantener horarios de sueño regulares. Evitar pantallas antes de dormir.',
        receta: ['Ibuprofeno 400mg — cada 8 hrs por 5 días', 'Magnesio 400mg — una vez al día por 30 días'],
        calificada: true,
        calificacion: 5,
        resena: 'Excelente doctor, muy atento y explicó todo con claridad.',
      },
      {
        id: 2,
        doctor: 'Dra. Patricia Vega',
        especialidad: 'Psicología',
        fecha: '2025-02-20',
        hora: '11:00 AM',
        tipo: 'Videoconsulta',
        precio: 450,
        imagen: 'https://randomuser.me/api/portraits/women/33.jpg',
        diagnostico: 'Ansiedad generalizada leve',
        notas: 'Se inicia terapia cognitivo-conductual. Técnicas de respiración y mindfulness recomendadas.',
        receta: ['Terapia semanal por 8 semanas', 'Ejercicio aeróbico 30 min/día'],
        calificada: true,
        calificacion: 5,
        resena: 'Me ayudó muchísimo. La recomiendo ampliamente.',
      },
      {
        id: 3,
        doctor: 'Dra. Elena Gómez',
        especialidad: 'Pediatría',
        fecha: '2025-01-15',
        hora: '09:30 AM',
        tipo: 'Presencial',
        precio: 350,
        imagen: 'https://img.freepik.com/fotos-premium/confiado-mi-capacidad-medica-retrato-recortado-atractiva-joven-doctora-pie-brazos-cruzados-oficina_590464-2228.jpg?semt=ais_hybrid&w=740&q=80',
        diagnostico: 'Infección respiratoria alta',
        notas: 'Reposo relativo, hidratación constante. Control en 7 días si persisten síntomas.',
        receta: ['Amoxicilina 500mg — cada 8 hrs por 7 días', 'Paracetamol 500mg — cada 6 hrs si hay fiebre'],
        calificada: false,
        calificacion: null,
        resena: null,
      },
    ],
  })

  const logout = () => setUsuario(null)

  const calificarConsulta = (historialId, calificacion, resena) => {
    setUsuario(prev => ({
      ...prev,
      historial: prev.historial.map(h =>
        h.id === historialId
          ? { ...h, calificada: true, calificacion, resena }
          : h
      ),
    }))
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout, calificarConsulta }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}