// src/pages/SettingsPage.tsx
import React from "react"
import { useTheme } from "@/hooks/useTheme"
import { useLoggerStore } from "@/modules/logger/loggerStore"
import { themeConfig } from "@/config/theme"

export const SettingsPage = () => {
  const { mode, toggleTheme } = useTheme()
  const { clearLogs } = useLoggerStore()

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6 text-sm text-zinc-200">
      <h1 className="text-xl font-bold text-cyan-400">⚙️ Configuración General</h1>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">🎨 Tema</h2>
        <p className="text-zinc-400">Tema actual: <strong className="text-white">{mode}</strong></p>
        <button
          className="omni-btn"
          onClick={toggleTheme}
        >
          Cambiar a {mode === "dark" ? "claro" : "oscuro"}
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">🧠 Logs del sistema</h2>
        <p className="text-zinc-400">Puedes limpiar el historial de eventos del sistema.</p>
        <button
          className="omni-btn bg-red-600 hover:bg-red-700"
          onClick={clearLogs}
        >
          Limpiar logs
        </button>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">📦 Configuración actual</h2>
        <pre className="bg-zinc-800 p-2 rounded text-xs overflow-x-auto">
          {JSON.stringify(themeConfig, null, 2)}
        </pre>
      </section>
    </div>
  )
}