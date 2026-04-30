export async function preguntarAClaude(mensajes, rol) {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const ultimoMensaje = mensajes[mensajes.length - 1].content.toLowerCase()

  if (rol === 'medico') {
    if (ultimoMensaje.includes('cédula') || ultimoMensaje.includes('cedula')) {
      return 'Tu cédula se verifica automáticamente con la base de datos de la SEP. El proceso tarda unos segundos. Si no la encuentra, verifica que el número sea correcto.'
    }
    if (ultimoMensaje.includes('registro') || ultimoMensaje.includes('inscribir')) {
      return 'El registro tiene 5 pasos: cuenta básica, datos personales, documentos, perfil público y confirmación. Todo desde la sección "Soy Médico".'
    }
    if (ultimoMensaje.includes('cobro') || ultimoMensaje.includes('pago') || ultimoMensaje.includes('comisión')) {
      return 'Jelfen no cobra suscripción. Solo retenemos un porcentaje por cada cita completada. El resto se deposita a tu CLABE semanal o quincenalmente.'
    }
    return 'Hola doctor 👨‍⚕️ Puedo ayudarte con tu registro, verificación de cédula, perfil o cobros. ¿Qué necesitas?'
  }

  if (ultimoMensaje.includes('cita') || ultimoMensaje.includes('agendar')) {
    return 'Para agendar una cita: busca tu doctor en "Encontrar un Doctor", revisa su disponibilidad y haz clic en "Reservar Cita". El pago se hace directo en la app.'
  }
  if (ultimoMensaje.includes('doctor') || ultimoMensaje.includes('médico') || ultimoMensaje.includes('especialista')) {
    return 'Puedes buscar médicos por especialidad, nombre o modalidad (presencial/videoconsulta). Todos están verificados ante la SEP ✅'
  }
  if (ultimoMensaje.includes('videoconsulta') || ultimoMensaje.includes('video')) {
    return 'Las videoconsultas se realizan directo desde la app. Solo necesitas cámara y micrófono. El médico te envía el enlace al confirmar la cita.'
  }
  return 'Hola 👋 Soy tu asistente en Jelfen. Puedo ayudarte a encontrar un doctor, agendar citas o resolver dudas. ¿En qué te ayudo?'
}