import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { Sidebar } from "@/components/ui/Sidebar";
import { TabContainer } from "@/layout/TabContainer";
import { Header } from "@/components/ui/Header";

interface OmniLayoutProps {
  children?: React.ReactNode;
}

export const OmniLayout: React.FC<OmniLayoutProps> = () => {
  const { sidebarCollapsed } = useAppStore();

  return (
    <div className="h-screen flex flex-col bg-omni-bg overflow-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 omni-grid-bg opacity-5 pointer-events-none" />

      {/* Encabezado */}
      <Header />

      {/* Área principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence mode="wait">
          <motion.div
            initial={false}
            animate={{
              width: sidebarCollapsed ? 60 : 240,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <Sidebar />
          </motion.div>
        </AnimatePresence>

        {/* Contenido */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <TabContainer />
          <main className="flex-1 overflow-auto bg-omni-bg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="p-6 h-full">
                <Outlet />
              </div>
            </motion.div>
          </main>
        </div>
      </div>

      {/* Efecto de línea scan */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="scan-line" />
      </div>
    </div>
  );
};
