// modules/tasks/store.ts
import { create } from "zustand"

export type Status = "pendiente" | "progreso" | "hecho"

export interface Task {
  id: string
  title: string
  status: Status
}

interface KanbanState {
  tasks: Task[]
  addTask: (title: string, status: Status) => void
  moveTask: (id: string, status: Status) => void
}

export const useKanbanStore = create<KanbanState>((set) => ({
  tasks: [],
  addTask: (title, status) =>
    set((state) => ({
      tasks: [...state.tasks, { id: crypto.randomUUID(), title, status }],
    })),
  moveTask: (id, status) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, status } : t
      ),
    })),
}))