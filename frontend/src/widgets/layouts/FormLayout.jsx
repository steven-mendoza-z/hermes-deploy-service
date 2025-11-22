import { useState, cloneElement } from "react";
import { useAppState } from "../../context/AppStateContext";
import FormAddServer from "../forms/FormAddServer";
import FormAddImage from "../forms/FormAddImage";
import FormAddRepo from "../forms/FormAddRepo";

const formSelected = {
  // Livestock
  // addLivestock: <FormAddLivestock />,
  addServer: <FormAddServer/>,
  addImage: <FormAddImage/>,
  addRepo: <FormAddRepo/>,
  addApp: <addApp/>,
};

export function FormLayout() {
  const { form, setForm } = useAppState();
  const [closing, setClosing] = useState(false);

  const rawContent = form !== "none" ? formSelected?.[form] ?? null : null;

  // Inyectamos una prop para que el form pueda solicitar cierre con animación
  const startClose = () => setClosing(true);
  const content = rawContent
    ? cloneElement(rawContent, { onRequestClose: startClose })
    : null;

  // Cuando terminan las animaciones de salida, desmontamos
  const handleAnimationEnd = (e) => {
    if (closing) {
      // Nos aseguramos que terminó alguna de las animaciones del layout
      setForm("none");
      setClosing(false);
    }
  };

  const handleOverlayClick = () => startClose();
  const stop = (e) => e.stopPropagation();

  if (!content) return null;

  return (
    <div
      className={`form-layout ${closing ? "closing" : ""}`}
      onClick={handleOverlayClick}
      onAnimationEnd={handleAnimationEnd}
    >
      <div className="form-out" />
      <div className="form-container card" onClick={stop}>
        {content}
      </div>
    </div>
  );
}

export default FormLayout;
