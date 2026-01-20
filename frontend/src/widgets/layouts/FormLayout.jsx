import { useState, cloneElement } from "react";
import { useAppState } from "../../context/AppStateContext";

import FormAddServer from "../forms/add/FormAddServer";
import FormAddImage from "../forms/add/FormAddImage";
import FormAddRepo from "../forms/add/FormAddRepo";
import FormAddApp from "../forms/add/FormAddApp";

import FormEditServer from "../forms/edit/FormEditServer";
import FormEditImage from "../forms/edit/FormEditImage";
import FormEditRepo from "../forms/edit/FormEditRepo";
import FormEditApp from "../forms/edit/FormEditApp";

import FormActionsServer from "../forms/actions/FormActionsServer";
import FormActionsImage from "../forms/actions/FormActionsImage";
import FormActionsRepo from "../forms/actions/FormActionsRepo";
import FormActionsApp from "../forms/actions/FormActionsApp";

import SshCmd from "../forms/actions/sshCmd";
import FormEditEnv from "../forms/edit/FormEditEnv";


// Ahora cada entrada es { form: JSX, type: string }
const formSelected = {
  addServer:   { form: <FormAddServer />,   type: "long-form" },
  addImage:    { form: <FormAddImage />,    type: "long-form" },
  addRepo:     { form: <FormAddRepo />,     type: "long-form" },
  addApp:      { form: <FormAddApp />,      type: "long-form" },

  editServer:  { form: <FormEditServer />,  type: "long-form" },
  editImage:   { form: <FormEditImage />,   type: "long-form" },
  editRepo:    { form: <FormEditRepo />,    type: "long-form" },
  editApp:     { form: <FormEditApp />,     type: "long-form" },
  editEnv:     { form: <FormEditEnv />,     type: "long-form" },

  actionsServer: { form: <FormActionsServer />, type: "short-form" },
  actionsImage:  { form: <FormActionsImage />,  type: "short-form" },
  actionsRepo:   { form: <FormActionsRepo />,   type: "short-form" },
  actionsApp:    { form: <FormActionsApp />,    type: "short-form" },

  sshCmd:    { form: <SshCmd/>,    type: "ssh-form" },
};

export function FormLayout() {
  const { form, setForm } = useAppState();
  const [closing, setClosing] = useState(false);

  // Obtenemos el objeto seleccionado: { form, type }
  const selected = form !== "none" ? formSelected?.[form] ?? null : null;

  const rawContent = selected?.form ?? null;
  const typeClass = selected?.type ?? "";

  // Inyectamos una prop para que el form pueda solicitar cierre con animación
  const startClose = () => setClosing(true);
  const content = rawContent
    ? cloneElement(rawContent, { onRequestClose: startClose })
    : null;

  // Cuando terminan las animaciones de salida, desmontamos
  const handleAnimationEnd = () => {
    if (closing) {
      setForm("none");
      setClosing(false);
    }
  };

  const handleOverlayClick = () => startClose();
  const stop = (e) => e.stopPropagation();

  if (!content) return null;

  return (
    <div
      className={`form-layout ${typeClass} ${closing ? "closing" : ""}`}
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
