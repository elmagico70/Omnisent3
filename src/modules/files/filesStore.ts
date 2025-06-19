import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  extension?: string;
  size: number;
  modified: Date;
  path: string;
  /** Optional base64 data for previews or download */
  data?: string;
  /** MIME type of the data */
  mimeType?: string;
  starred?: boolean;
  protected?: boolean;
}

const generateMockFiles = (): FileItem[] => [
  { id: "1", name: "Documents", type: "folder", size: 4096, modified: new Date("2024-01-15"), path: "/Documents" },
  { id: "2", name: "Projects", type: "folder", size: 4096, modified: new Date("2024-01-20"), path: "/Projects" },
  { id: "3", name: "Downloads", type: "folder", size: 4096, modified: new Date("2024-01-25"), path: "/Downloads" },
  { id: "4", name: "system-config.json", type: "file", extension: "json", size: 2048, modified: new Date("2024-01-18"), path: "/system-config.json", protected: true },
  { id: "5", name: "README.md", type: "file", extension: "md", size: 1024, modified: new Date("2024-01-22"), path: "/README.md", starred: true },
  { id: "6", name: "backup-2024.zip", type: "file", extension: "zip", size: 1048576, modified: new Date("2024-01-10"), path: "/backup-2024.zip" },
  { id: "7", name: "screenshot.png", type: "file", extension: "png", size: 524288, modified: new Date("2024-01-24"), path: "/screenshot.png" },
  { id: "8", name: "main.tsx", type: "file", extension: "tsx", size: 8192, modified: new Date("2024-01-25"), path: "/main.tsx", starred: true },
  { id: "9", name: "audio-track.mp3", type: "file", extension: "mp3", size: 3145728, modified: new Date("2024-01-12"), path: "/audio-track.mp3" },
  { id: "10", name: "presentation.mp4", type: "file", extension: "mp4", size: 10485760, modified: new Date("2024-01-08"), path: "/presentation.mp4" },
];

interface FilesState {
  files: FileItem[];
  currentPath: string;
  viewMode: "grid" | "list";
  searchQuery: string;
  selectedFilter: "all" | "starred" | "protected";
  sortOption: "name" | "date" | "size";
  selectedFileId: string | null;
  uploading: boolean;
  addFile: (file: Omit<FileItem, "id" | "path" | "modified">) => void;
  createFolder: (name: string) => void;
  deleteFile: (id: string) => void;
  setPath: (path: string) => void;
  goBack: () => void;
  setViewMode: (mode: "grid" | "list") => void;
  setSearchQuery: (query: string) => void;
  setSelectedFilter: (filter: "all" | "starred" | "protected") => void;
  setSortOption: (opt: "name" | "date" | "size") => void;
  setSelectedFileId: (id: string | null) => void;
  setUploading: (val: boolean) => void;
  reset: () => void;
}

const initialState: Omit<FilesState,
  | "addFile"
  | "createFolder"
  | "deleteFile"
  | "setPath"
  | "goBack"
  | "setViewMode"
  | "setSearchQuery"
  | "setSelectedFilter"
  | "setSortOption"
  | "setSelectedFileId"
  | "setUploading"
  | "reset"> = {
  files: generateMockFiles(),
  currentPath: "/",
  viewMode: "grid",
  searchQuery: "",
  selectedFilter: "all",
  sortOption: "name",
  selectedFileId: null,
  uploading: false,
};

export const useFilesStore = create<FilesState>()(
  persist(
    (set, get) => ({
      ...initialState,
      addFile: (file) =>
        set((state) => ({
          files: [
            ...state.files,
            {
              ...file,
              id: crypto.randomUUID(),
              modified: new Date(),
              path:
                state.currentPath === "/"
                  ? `/${file.name}`
                  : `${state.currentPath}/${file.name}`,
            },
          ],
        })),
      createFolder: (name) =>
        set((state) => ({
          files: [
            ...state.files,
            {
              id: crypto.randomUUID(),
              name,
              type: "folder",
              size: 4096,
              modified: new Date(),
              path:
                state.currentPath === "/"
                  ? `/${name}`
                  : `${state.currentPath}/${name}`,
            },
          ],
        })),
      deleteFile: (id) =>
        set((state) => ({ files: state.files.filter((f) => f.id !== id) })),
      setPath: (path) => set({ currentPath: path }),
      goBack: () =>
        set((state) => {
          if (state.currentPath === "/") return state;
          const parts = state.currentPath.split("/").filter(Boolean);
          parts.pop();
          const newPath = `/${parts.join("/")}`;
          return { currentPath: newPath || "/" };
        }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedFilter: (filter) => set({ selectedFilter: filter }),
      setSortOption: (opt) => set({ sortOption: opt }),
      setSelectedFileId: (id) => set({ selectedFileId: id }),
      setUploading: (val) => set({ uploading: val }),
      reset: () => set(initialState),
    }),
    {
      name: "files-storage",
      merge: (persistedState, currentState) => {
        const state = { ...currentState, ...(persistedState as FilesState) };
        state.files = state.files.map((f) => ({
          ...f,
          modified: new Date(f.modified),
        }));
        return state;
      },
      partialize: (state) => ({
        files: state.files,
        currentPath: state.currentPath,
        viewMode: state.viewMode,
        searchQuery: state.searchQuery,
        selectedFilter: state.selectedFilter,
        sortOption: state.sortOption,
      }),
    }
  )
);
