import { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto
const AppStateContext = createContext();

// Hook para acceder al contexto fácilmente
export const useAppState = () => useContext(AppStateContext);

// Proveedor del contexto
export function AppStateProvider({ children }) {
  const [form, setForm] = useState("none");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // móvil si ancho <= 768px
    };

    handleResize(); // verificar al montar
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppStateContext.Provider value={{ form, setForm, isMobile }}>
      {children}
    </AppStateContext.Provider>
  );
}
