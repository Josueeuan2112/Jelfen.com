import { useState, useEffect, createContext, useContext, useCallback } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const agregar = useCallback((mensaje, tipo = 'exito', duracion = 5000, onClick = null) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, mensaje, tipo, onClick }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duracion)
  }, [])

  const quitar = (id) => setToasts(prev => prev.filter(t => t.id !== id))

  const iconos = { exito: '✅', error: '❌', info: 'ℹ️', advertencia: '⚠️' }
  const colores = { exito: 'bg-green-500', error: 'bg-red-500', info: 'bg-sky-500', advertencia: 'bg-yellow-500' }

  return (
    <ToastContext.Provider value={{ agregar }}>
      {children}

      <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${colores[toast.tipo]} text-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-3 ${toast.onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
            style={{ animation: 'slideIn 0.3s ease-out' }}
            onClick={() => {
              if (toast.onClick) {
                toast.onClick()
                quitar(toast.id)
              }
            }}
          >
            <span className="text-xl flex-shrink-0">{iconos[toast.tipo]}</span>
            <div className="flex-1">
              <p className="text-sm font-medium">{toast.mensaje}</p>
              {toast.onClick && (
                <p className="text-xs text-white/80 mt-0.5">Toca para ver el detalle →</p>
              )}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); quitar(toast.id) }}
              className="text-white/70 hover:text-white text-lg flex-shrink-0 leading-none"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}