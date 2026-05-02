// ─── MOTOR DE CONVERSACIÓN INTELIGENTE ────────────────────────────────────────

const respuestasUsadas = new Set()

function elegirRespuesta(opciones) {
  const disponibles = opciones.filter(r => !respuestasUsadas.has(r))
  const lista = disponibles.length > 0 ? disponibles : opciones
  const elegida = lista[Math.floor(Math.random() * lista.length)]
  respuestasUsadas.add(elegida)
  return elegida
}

function analizarHistorial(mensajes) {
  const textoCompleto = mensajes
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ')

  const preguntasHechas = mensajes
    .filter(m => m.role === 'assistant')
    .map(m => m.content.toLowerCase())

  return { textoCompleto, preguntasHechas }
}

function yaPregunté(preguntasHechas, palabrasClave) {
  return preguntasHechas.some(p => palabrasClave.some(k => p.includes(k)))
}

// ─── SÍNTOMAS Y ESPECIALIDADES ────────────────────────────────────────────────

const PATRONES = [
  {
    palabras: ['cabeza', 'migraña', 'cefalea', 'mareo', 'vértigo', 'hormigueo', 'convulsión', 'epilepsia'],
    especialidad: 'Neurología',
    emoji: '🧠',
    seguimientos: [
      '¿Con qué frecuencia te aparece este dolor? ¿Es todos los días o de vez en cuando?',
      '¿El dolor es pulsante, como un latido, o más bien una presión constante?',
      '¿Notas que empeora con la luz, el ruido o el movimiento?',
      '¿Has tomado algo para el dolor? ¿Te ayuda o no hace efecto?',
      '¿El mareo viene acompañado de náuseas o sensación de que todo gira?',
    ],
  },
  {
    palabras: ['pecho', 'corazón', 'palpitaciones', 'taquicardia', 'arritmia', 'infarto', 'presión alta'],
    especialidad: 'Cardiología',
    emoji: '❤️',
    urgente: true,
    seguimientos: [
      '⚠️ Importante: ¿El dolor en el pecho es intenso o se irradia hacia el brazo o mandíbula? Si es así, ve a urgencias de inmediato.',
      '¿Las palpitaciones aparecen en reposo, al hacer ejercicio o en momentos de estrés?',
      '¿Tienes antecedentes familiares de problemas del corazón?',
      '¿Te has medido la presión arterial recientemente? ¿Sabes cuánto tienes?',
    ],
  },
  {
    palabras: ['piel', 'acné', 'manchas', 'comezón', 'picazón', 'sarpullido', 'urticaria', 'eczema', 'psoriasis', 'rozadura'],
    especialidad: 'Dermatología',
    emoji: '🌿',
    seguimientos: [
      '¿La zona afectada pica, duele o simplemente la notas diferente visualmente?',
      '¿Hace cuánto tiempo tienes esto? ¿Apareció de repente o fue poco a poco?',
      '¿Has cambiado algún producto de limpieza, crema o detergente recientemente?',
      '¿Solo en una zona del cuerpo o está apareciendo en varias partes?',
      '¿Ha cambiado de tamaño, color o forma desde que lo notaste por primera vez?',
    ],
  },
  {
    palabras: ['espalda', 'columna', 'lumbar', 'rodilla', 'tobillo', 'hueso', 'fractura', 'articulación', 'lesión', 'deporte'],
    especialidad: 'Traumatología',
    emoji: '🦴',
    seguimientos: [
      '¿El dolor apareció después de un golpe o esfuerzo, o surgió solo sin causa aparente?',
      '¿El dolor es constante o solo al moverte o apoyar peso en esa zona?',
      '¿Notas inflamación, moretón o que la zona está caliente?',
      '¿Haces ejercicio o actividad física frecuente? ¿Esto pasó durante el ejercicio?',
      '¿Cuánto tiempo llevas con este dolor? ¿Ha mejorado, empeorado o sigue igual?',
    ],
  },
  {
    palabras: ['ojo', 'vista', 'visión', 'lentes', 'lagrimeo', 'glaucoma', 'catarata', 'miopía', 'astigmatismo'],
    especialidad: 'Oftalmología',
    emoji: '👁️',
    seguimientos: [
      '¿La visión borrosa es en un ojo, en los dos, o solo en ciertas distancias?',
      '¿Tienes irritación, enrojecimiento o sensación de tener algo dentro del ojo?',
      '¿Cuándo fue tu último examen de la vista? ¿Usas lentes actualmente?',
      '¿El problema apareció de repente o ha sido gradual con el tiempo?',
    ],
  },
  {
    palabras: ['diente', 'muela', 'encía', 'dental', 'caries', 'boca', 'ortodoncia', 'implante'],
    especialidad: 'Odontología',
    emoji: '🦷',
    seguimientos: [
      '¿El dolor es constante o aparece al comer, tomar algo frío o caliente?',
      '¿Notas que la encía está inflamada, sangra o tiene mal aspecto?',
      '¿Cuándo fue la última vez que fuiste al dentista?',
      '¿El dolor empezó de repente o fue aumentando poco a poco?',
    ],
  },
  {
    palabras: ['ansiedad', 'depresión', 'estrés', 'tristeza', 'angustia', 'pánico', 'fobia', 'trauma', 'insomnio', 'dormir', 'nervios', 'mental'],
    especialidad: 'Psicología',
    emoji: '🧘',
    seguimientos: [
      '¿Hace cuánto tiempo te sientes así? ¿Empezó con algo en particular o fue gradual?',
      '¿Esto está afectando tu trabajo, tus relaciones o tu día a día?',
      '¿Has hablado con alguien de confianza sobre esto, o lo has cargado solo?',
      '¿Hay algo específico que dispara esta sensación o aparece sin motivo aparente?',
      '¿Has buscado ayuda antes o sería tu primera vez con un profesional?',
    ],
  },
  {
    palabras: ['niño', 'hijo', 'bebé', 'bebe', 'lactante', 'infantil', 'recién nacido', 'pequeño', 'vacuna'],
    especialidad: 'Pediatría',
    emoji: '👶',
    seguimientos: [
      '¿Cuántos años o meses tiene el pequeño?',
      '¿Tiene fiebre? Si es así, ¿cuánto marca el termómetro?',
      '¿Come y bebe normal, o ha bajado el apetito?',
      '¿Los síntomas llevan horas, días o ya más de una semana?',
      '¿Ha tenido algo parecido antes o es la primera vez?',
    ],
  },
  {
    palabras: ['fiebre', 'gripa', 'gripe', 'resfriado', 'tos', 'mocos', 'congestionado', 'malestar', 'cansancio', 'náuseas', 'vómito', 'diarrea'],
    especialidad: 'Medicina General',
    emoji: '🩺',
    seguimientos: [
      '¿Hace cuántos días empezaron los síntomas?',
      '¿Tienes fiebre? ¿Sabes cuánto tienes de temperatura?',
      '¿Has tomado algo para los síntomas? ¿Te ha ayudado?',
      '¿Alguien más en tu casa o trabajo tiene los mismos síntomas?',
    ],
  },
]

function detectarPatron(texto) {
  const lower = texto.toLowerCase()
  for (const patron of PATRONES) {
    if (patron.palabras.some(p => lower.includes(p))) {
      return patron
    }
  }
  return null
}

// ─── FLUJO PARA PACIENTES ─────────────────────────────────────────────────────

function responderPaciente(mensajes, contexto) {
  const { textoCompleto, preguntasHechas } = analizarHistorial(mensajes)
  const ultimoMensaje = mensajes[mensajes.length - 1].content
  const ultimoLower = ultimoMensaje.toLowerCase()
  const nombre = contexto.nombre
  const s = nombre ? `${nombre}, ` : ''
  const sintomasAcumulados = contexto.sintomas || []

  // Saludo inicial
  if ((ultimoLower.includes('hola') || ultimoLower.includes('buenas') || ultimoLower.includes('buenos')) && mensajes.filter(m => m.role === 'user').length === 1) {
    if (nombre) {
      return elegirRespuesta([
        `¡Hola ${nombre}! Qué gusto tenerte aquí 👋 Soy el asistente de Jelfen. Cuéntame, ¿qué te trae por aquí hoy? ¿Tienes alguna molestia o síntoma que quieras que revisemos?`,
        `¡Bienvenido ${nombre}! 😊 Estoy aquí para ayudarte a encontrar el especialista ideal para lo que necesites. ¿Cómo te has sentido últimamente? ¿Hay algo que te esté molestando?`,
      ])
    }
    return elegirRespuesta([
      `¡Hola! Bienvenido a Jelfen 👋 Soy tu asistente médico. Para ayudarte mejor, ¿me puedes decir tu nombre? Y cuéntame, ¿qué te trae por aquí hoy?`,
      `¡Hola! Qué bueno que estás aquí 😊 Soy el asistente de Jelfen. ¿Cómo te llamas? Así puedo orientarte mejor según lo que necesites.`,
    ])
  }

  // Detectar patrón de síntoma
  const patron = detectarPatron(textoCompleto)

  if (patron) {
    // Ver qué seguimientos ya hicimos
    const seguimientosPendientes = patron.seguimientos.filter(
      s => !yaPregunté(preguntasHechas, [s.slice(0, 20).toLowerCase()])
    )

    // Si ya hicimos 2+ preguntas de seguimiento, dar recomendación final
    const preguntasDeEstePatron = preguntasHechas.filter(p =>
      patron.seguimientos.some(s => p.includes(s.slice(0, 15).toLowerCase()))
    ).length

    if (preguntasDeEstePatron >= 2 || seguimientosPendientes.length === 0) {
      return elegirRespuesta([
        `Con todo lo que me has contado ${s}lo más indicado es que veas a un especialista en **${patron.especialidad}**. En Jelfen tenemos varios disponibles, todos verificados ante la SEP. ${patron.emoji}\n\nPuedo mostrarte los que están disponibles ahora mismo. ¿Te gustaría ver sus perfiles y precios?`,
        `Gracias por contarme todos los detalles ${s}— eso me ayuda mucho. Basándome en tus síntomas, un médico de **${patron.especialidad}** es quien mejor puede evaluarte y darte un diagnóstico. ${patron.emoji}\n\n¿Quieres que te muestre los especialistas disponibles en Jelfen?`,
        `Entiendo la situación ${s}y te digo con confianza que un **${patron.especialidad}** es el especialista indicado para lo que describes. ${patron.emoji} Todos nuestros especialistas están verificados y puedes agendar hoy mismo.\n\n¿Te muestro quiénes están disponibles?`,
      ])
    }

    // Hacer pregunta de seguimiento
    if (seguimientosPendientes.length > 0) {
      const intro = elegirRespuesta([
        `Entiendo, gracias por contarme. `,
        `Ah ya veo, eso es importante saberlo. `,
        `Bien, eso me ayuda a orientarte mejor. `,
        `Okay, ${s}eso es una buena pista. `,
      ])
      return intro + seguimientosPendientes[0]
    }
  }

  // Respuestas a preguntas comunes sin síntoma claro
  if (ultimoLower.includes('cita') || ultimoLower.includes('agendar') || ultimoLower.includes('reservar')) {
    return elegirRespuesta([
      `Agendar una cita ${s}es muy fácil:\n\n1. Ve a "Doctores" en el menú\n2. Encuentra al especialista que necesitas\n3. Haz clic en "Reservar"\n4. Elige fecha, hora y tipo de consulta\n5. ¡Listo! Recibes confirmación al momento\n\n¿Ya sabes qué especialista necesitas o quieres que te ayude a encontrarlo?`,
      `Claro que sí ${s}— el proceso es rapidísimo. Entras a "Doctores", encuentras al médico que te llame la atención, ves su perfil, horarios y precio, y reservas directo. ¿Para qué especialidad estás buscando?`,
    ])
  }

  if (ultimoLower.includes('precio') || ultimoLower.includes('costo') || ultimoLower.includes('cuánto') || ultimoLower.includes('cobran')) {
    return elegirRespuesta([
      `Los precios en Jelfen ${s}son completamente transparentes — los ves antes de agendar, sin sorpresas. Van desde $200 MXN para medicina general hasta $700 MXN para especialistas de alto nivel. Cada médico fija el suyo libremente.`,
      `Buena pregunta ${s}— en Jelfen cada médico publica su precio en el perfil. Puedes comparar antes de decidir. Los rangos van de $200 a $700 MXN dependiendo de la especialidad y experiencia del doctor.`,
    ])
  }

  if (ultimoLower.includes('video') || ultimoLower.includes('videoconsulta') || ultimoLower.includes('línea')) {
    return elegirRespuesta([
      `Las videoconsultas ${s}son perfectas si no puedes salir de casa o estás fuera de la ciudad. Funcionan directo en el navegador, sin instalar nada. Solo necesitas cámara y micrófono. El médico te manda el enlace al confirmar. ¿Prefieres videoconsulta o consulta presencial?`,
      `Con videoconsulta ${s}puedes atenderte desde donde estés — incluso en otra ciudad. La calidad es la misma que en persona. ¿Tienes algún síntoma que quieras que evaluemos por video?`,
    ])
  }

  if (ultimoLower.includes('verificado') || ultimoLower.includes('confiable') || ultimoLower.includes('seguro') || ultimoLower.includes('real')) {
    return elegirRespuesta([
      `Todos los médicos en Jelfen ${s}pasan por verificación real ante la SEP antes de publicar su perfil — nada de perfiles sin validar. Además nuestro equipo revisa los documentos manualmente. Ves el badge ✅ en cada perfil como garantía.`,
      `Esa es una pregunta muy válida ${s}— en internet hay de todo. En Jelfen verificamos cada cédula directamente con el SIICPC de la SEP y revisamos documentos con personas reales de nuestro equipo. Sin eso, no aparecen en la plataforma.`,
    ])
  }

  // Si el usuario responde con síntoma nuevo después de preguntas
  if (patron && sintomasAcumulados.length > 0) {
    return elegirRespuesta([
      `Eso que me dices ${s}me confirma más la dirección. ¿Y ${patron.seguimientos[Math.floor(Math.random() * patron.seguimientos.length)].toLowerCase()}`,
      `Interesante, eso ayuda a tener el panorama completo. ${patron.seguimientos[Math.floor(Math.random() * patron.seguimientos.length)]}`,
    ])
  }

  // Respuesta genérica inteligente cuando no detecta nada específico
  return elegirRespuesta([
    `Entiendo ${s}quiero asegurarme de orientarte bien. ¿Puedes contarme un poco más sobre lo que sientes? Por ejemplo, ¿dónde exactamente sientes la molestia y hace cuánto tiempo?`,
    `Okay ${s}ayúdame a entender mejor. ¿La molestia es física — dolor, malestar, algo que notas en tu cuerpo — o es más emocional o de bienestar general?`,
    `Para darte la mejor orientación ${s}necesito entender un poco más. ¿Qué fue lo primero que notaste? ¿Cuándo empezó exactamente?`,
    `${s}quiero ayudarte a encontrar exactamente lo que necesitas. Cuéntame con tus propias palabras cómo te has sentido — no hay respuesta incorrecta.`,
  ])
}

// ─── FLUJO PARA MÉDICOS ───────────────────────────────────────────────────────

function responderMedico(mensajes, contexto) {
  const { textoCompleto, preguntasHechas } = analizarHistorial(mensajes)
  const ultimoLower = mensajes[mensajes.length - 1].content.toLowerCase()
  const nombre = contexto.nombre
  const s = nombre ? `${nombre}, ` : ''

  if (ultimoLower.includes('cédula') || ultimoLower.includes('cedula') || ultimoLower.includes('sep') || ultimoLower.includes('siicpc')) {
    if (!yaPregunté(preguntasHechas, ['número de cédula', 'tienes el número'])) {
      return `Tu cédula se verifica automáticamente con el SIICPC de la SEP en tiempo real. Solo necesitas tener el número a la mano al registrarte.\n\n¿Ya tienes tu número de cédula o necesitas ayuda para ubicarlo?`
    }
    return `Si el sistema no encuentra tu cédula, puede ser porque el número tiene un dígito incorrecto o porque la SEP aún no la ha registrado en su base de datos digital. En ese caso puedes contactarnos a Jelfen@outlook.es y te ayudamos manualmente.`
  }

  if (ultimoLower.includes('registro') || ultimoLower.includes('inscribir') || ultimoLower.includes('unir') || ultimoLower.includes('empezar')) {
    if (!yaPregunté(preguntasHechas, ['especialidad', 'especialista', 'general'])) {
      return `El registro tiene 5 pasos y toma menos de 20 minutos:\n\n1. Cuenta básica (correo y contraseña)\n2. Datos personales (CURP, RFC, identificación)\n3. Documentos profesionales (título y cédula)\n4. Perfil público (foto, bio, servicios, precio)\n5. Verificación y publicación\n\n¿Eres médico general o tienes alguna especialidad?`
    }
    return `Puedes empezar ahora mismo haciendo clic en "Soy Médico" en la barra de navegación. Si tienes algún problema en algún paso específico, dime en cuál estás y te ayudo.`
  }

  if (ultimoLower.includes('cobro') || ultimoLower.includes('pago') || ultimoLower.includes('comisión') || ultimoLower.includes('dinero') || ultimoLower.includes('gano') || ultimoLower.includes('deposito')) {
    if (!yaPregunté(preguntasHechas, ['clabe', 'banco', 'cuenta'])) {
      return `Jelfen no cobra suscripción ni cuota fija. El modelo es simple: por cada cita completada y pagada en la plataforma, Jelfen retiene un porcentaje como comisión. El resto va directo a tu CLABE.\n\n¿Ya tienes tu CLABE interbancaria lista para registrarla?`
    }
    return `Los depósitos se hacen de forma automática en ciclos semanales o quincenales, dependiendo de lo que configures en tu perfil. Puedes ver el historial de pagos en tu panel de médico.`
  }

  if (ultimoLower.includes('perfil') || ultimoLower.includes('foto') || ultimoLower.includes('descripción') || ultimoLower.includes('bio')) {
    if (!yaPregunté(preguntasHechas, ['modalidad', 'presencial', 'videoconsulta'])) {
      return `Tu perfil es tu carta de presentación para los pacientes. Incluye foto, biografía, especialidad, servicios, horarios, precio y modalidad de atención.\n\n¿Planeas atender de forma presencial, por videoconsulta, o ambas?`
    }
    return `Una buena foto profesional y una biografía clara aumentan significativamente tus reservas. Los pacientes confían más en perfiles completos. ¿Quieres consejos sobre cómo optimizar tu descripción?`
  }

  if (ultimoLower.includes('tiempo') || ultimoLower.includes('cuánto') || ultimoLower.includes('demora') || ultimoLower.includes('tarda') || ultimoLower.includes('espera')) {
    return elegirRespuesta([
      `La verificación automática de cédula ante la SEP es instantánea. La revisión humana de documentos por nuestro equipo toma máximo 48 horas hábiles. Si todo está en orden, en menos de 2 días ya tienes tu perfil publicado.`,
      `Rápido: la cédula se verifica en segundos con la SEP. Los documentos los revisa nuestro equipo en máximo 48 horas. Si hay algo que corregir, te avisamos exactamente qué es y tienes 5 días para actualizarlo.`,
    ])
  }

  if (ultimoLower.includes('especialidad') || ultimoLower.includes('especialista') || ultimoLower.includes('certificado')) {
    return `Si tienes especialidad, sube tu certificado y cédula de especialidad durante el registro. Una vez verificados, recibes el badge "🔵 Especialista Verificado" en tu perfil, lo que genera mucha más confianza en los pacientes y justifica precios más altos.`
  }

  if (ultimoLower.includes('precio') || ultimoLower.includes('cuánto cobrar') || ultimoLower.includes('tarifa')) {
    return `Tú fijas tu propio precio — Jelfen no interviene en eso. Para orientarte, el promedio en Mérida es:\n\n• Medicina General: $200 - $400 MXN\n• Especialistas: $450 - $700 MXN\n\nSi eres nuevo en la plataforma, un precio competitivo al inicio te ayuda a conseguir tus primeras reseñas rápidamente.`
  }

  // Saludo médico
  if (ultimoLower.includes('hola') || ultimoLower.includes('buenas') || mensajes.filter(m => m.role === 'user').length === 1) {
    if (nombre) {
      return `¡Hola Dr./Dra. ${nombre}! 👨‍⚕️ Bienvenido a Jelfen. Estoy aquí para ayudarte con todo lo relacionado al registro y la plataforma. ¿Estás pensando en unirte o ya empezaste el proceso?`
    }
    return `¡Bienvenido a Jelfen! 👨‍⚕️ Soy el asistente para médicos. Puedo ayudarte con el registro, la verificación de cédula, tu perfil y los cobros. ¿Me dices tu nombre y en qué te puedo orientar?`
  }

  return elegirRespuesta([
    `Entiendo tu pregunta. Para darte la respuesta más útil ${s}¿puedes darme un poco más de contexto? ¿En qué parte del proceso estás exactamente?`,
    `Buena pregunta ${s}— dime un poco más sobre tu situación específica para orientarte mejor. ¿Ya tienes cuenta en Jelfen o estás considerando unirte?`,
    `${s}puedo ayudarte con eso. ¿Me explicas un poco más qué necesitas exactamente para darte la información correcta?`,
  ])
}

// ─── FUNCIÓN PRINCIPAL ────────────────────────────────────────────────────────

export async function preguntarAClaude(mensajes, rol, contexto = {}) {
  // Simula tiempo de respuesta realista (entre 0.8 y 1.5 segundos)
  const delay = 800 + Math.random() * 700
  await new Promise(resolve => setTimeout(resolve, delay))

  if (rol === 'medico') {
    return responderMedico(mensajes, contexto)
  }

  return responderPaciente(mensajes, contexto)
}