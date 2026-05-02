export const PATRONES_SINTOMAS = [
  { palabras: ['cabeza', 'migraña', 'cefalea', 'mareo', 'vértigo', 'desmayo', 'hormigueo'], especialidad: 'Neurología', emoji: '🧠', descripcion: 'Especialistas en sistema nervioso y cerebro' },
  { palabras: ['pecho', 'corazón', 'palpitaciones', 'taquicardia', 'presión', 'infarto', 'arritmia'], especialidad: 'Cardiología', emoji: '❤️', descripcion: 'Especialistas en corazón y sistema cardiovascular' },
  { palabras: ['piel', 'acné', 'manchas', 'comezón', 'picazón', 'sarpullido', 'urticaria', 'eczema'], especialidad: 'Dermatología', emoji: '🌿', descripcion: 'Especialistas en piel, cabello y uñas' },
  { palabras: ['espalda', 'columna', 'lumbar', 'rodilla', 'tobillo', 'hueso', 'fractura', 'articulación', 'lesión'], especialidad: 'Traumatología', emoji: '🦴', descripcion: 'Especialistas en huesos, músculos y articulaciones' },
  { palabras: ['ojo', 'vista', 'visión', 'lentes', 'lagrimeo', 'glaucoma', 'catarata', 'miopía'], especialidad: 'Oftalmología', emoji: '👁️', descripcion: 'Especialistas en salud visual y enfermedades oculares' },
  { palabras: ['diente', 'muela', 'encía', 'dental', 'caries', 'boca', 'ortodoncia'], especialidad: 'Odontología', emoji: '🦷', descripcion: 'Especialistas en salud bucal y dental' },
  { palabras: ['ansiedad', 'depresión', 'estrés', 'tristeza', 'angustia', 'pánico', 'insomnio', 'dormir', 'nervios'], especialidad: 'Psicología', emoji: '🧘', descripcion: 'Especialistas en salud mental y bienestar emocional' },
  { palabras: ['niño', 'hijo', 'bebé', 'bebe', 'infantil', 'lactante', 'vacuna'], especialidad: 'Pediatría', emoji: '👶', descripcion: 'Especialistas en salud infantil' },
  { palabras: ['fiebre', 'gripa', 'gripe', 'resfriado', 'tos', 'malestar', 'cansancio', 'náuseas', 'vómito', 'diarrea'], especialidad: 'Medicina General', emoji: '🩺', descripcion: 'Atención primaria y medicina preventiva' },
]

export function detectarEspecialidad(texto) {
  const lower = texto.toLowerCase()
  for (const patron of PATRONES_SINTOMAS) {
    if (patron.palabras.some(p => lower.includes(p))) {
      return patron
    }
  }
  return null
}