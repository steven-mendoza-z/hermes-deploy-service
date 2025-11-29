import { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto
const AppStateContext = createContext();

// Hook para acceder al contexto fácilmente
export const useAppState = () => useContext(AppStateContext);

export function AppStateProvider({ children }) {
  const [form, _setForm] = useState("none");
  const [formObject, setFormObject] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedServer, setSelectedServer] = useState(null);

  const setForm = (newForm) => {
    _setForm(newForm);
    setFormObject(null); // limpiar object siempre
  };

  const setAdvancedForm = (newForm, newObject = null) => {
    _setForm(newForm);
    setFormObject(newObject);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        form,
        formObject,
        isMobile,
        setForm, 
        setFormObject,         // ← setForm limpia object
        setAdvancedForm,  // ← setAdvancedForm controla ambos
        selectedServer,
        setSelectedServer,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}
