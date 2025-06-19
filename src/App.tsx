import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Refine } from "@refinedev/core";
import { RefineSnackbarProvider } from "@refinedev/mui";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import { Toaster } from "react-hot-toast";

// Layouts y envoltorios
import { OmniLayout } from "@/layout/OmniLayout";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { ErrorPage } from "@/components/system/ErrorPage";
import { LoadingFallback } from "@/components/ui/LoadingFallback";

// Rutas públicas y privadas
import { PrivateRoute } from "@/components/utils/PrivateRoute";
import { AuthProvider } from "@/components/auth/AuthContext";

// Páginas principales
import DashboardPage from "@/pages/DashboardPage";
import { SearchPage } from "@/modules/search/SearchPage";
import { FilesPage } from "@/pages/FilesPage"; // actualizado
import { LoggerPage } from "@/pages/LoggerPage"; // nuevo
import { NotesPage } from "@/pages/NotesPage"; // actualizado
import { AIPage } from "@/modules/ai/AIPage";
import { SettingsPage } from "@/modules/settings/SettingsPage";
import { KanbanPage } from "@/modules/tasks/KanbanPage";

// Lazy modules
const AdminPanel = lazy(() => import("@/pages/AdminPanelPage")); // actualizado
const LoginPage = lazy(() => import("@/modules/auth/LoginPage"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RefineKbarProvider>
        <RefineSnackbarProvider>
          <Refine
            routerProvider={undefined}
            dataProvider={undefined}
            options={{ syncWithLocation: true, warnWhenUnsavedChanges: true }}
          >
            <AuthProvider>
              <ThemeProvider defaultTheme="dark" storageKey="omnisent-theme">
                <BrowserRouter>
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<OmniLayout />} errorElement={<ErrorPage />}>
                        {/* Rutas principales */}
                        <Route index element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/search" element={<SearchPage />} />
                        <Route path="/files" element={<FilesPage />} />
                        <Route path="/logger" element={<LoggerPage />} />
                        <Route path="/notes" element={<NotesPage />} />
                        <Route path="/ai" element={<AIPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/tasks" element={<KanbanPage />} />

                        {/* Rutas privadas */}
                        <Route
                          path="/admin"
                          element={
                            <PrivateRoute>
                              <AdminPanel />
                            </PrivateRoute>
                          }
                        />

                        {/* Login */}
                        <Route path="/login" element={<LoginPage />} />

                        {/* 404 y fallback */}
                        <Route path="*" element={<ErrorPage />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </BrowserRouter>

                <Toaster position="top-right" />
                <RefineKbar />
              </ThemeProvider>
            </AuthProvider>
          </Refine>
        </RefineSnackbarProvider>
      </RefineKbarProvider>
    </QueryClientProvider>
  );
};

export default App;
