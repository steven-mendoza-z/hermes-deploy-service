// src/views/deployments/forms/FormEditEnv.jsx
import { useState, useMemo } from "react";
import { useAppState } from "../../../context/AppStateContext.jsx";
import EditForm from "../components/EditForm.jsx";
import { useTranslation } from "react-i18next";
import {
  useEnvs,
  useEnvVars,
  useCreateEnvVar,
  useUpdateEnvVar,
  useDeleteEnvVar,
} from "../../../features/deployments/envs/hooks.js";

function EnvVarEditor({
  envVar,
  pendingValue,
  onChangeValue,
  onSave,
  onDelete,
  isNew = false,
  pendingName,
  onChangeName,
}) {
  return (
    <div className="env-editor row full-view gap10">
      {isNew ? (
        <input
          type="text"
          className="customInput"
          placeholder="NOMBRE_VAR"
          value={pendingName || ""}
          onChange={(e) => onChangeName?.(e.target.value)}
        />
      ) : (
        <p className="h5 mono">{envVar.name}</p>
      )}

      <input
        type="password"
        className="full-h customInput"
        value={pendingValue || ""}
        placeholder="Nuevo valor (secreto)"
        onChange={(e) => onChangeValue(e.target.value)}
      />

      <button type="full-h" className="btn primary" onClick={onSave}>
        Save
      </button>

      <button type="button" className="btn ghost" onClick={onDelete}>
        <img src="actions/delete.svg" alt="delete" className="icon" />
      </button>
    </div>
  );
}

export default function FormEditEnv({ onRequestClose }) {
  const { formObject } = useAppState();
  const appId = formObject?.id;
  const { t } = useTranslation();

  const { data: allEnvs = [] } = useEnvs();
  const { data: allEnvVars = [] } = useEnvVars();

  const createEnvVar = useCreateEnvVar();
  const updateEnvVar = useUpdateEnvVar();
  const deleteEnvVar = useDeleteEnvVar();

  // 👇 Un solo Env por app
  const envForApp = useMemo(
    () => allEnvs.find((e) => e.app === appId) || null,
    [allEnvs, appId]
  );

  const envId = envForApp?.id ?? null;

  // EnvVars existentes de ese env
  const envVars = useMemo(
    () => allEnvVars.filter((v) => v.env === envId),
    [allEnvVars, envId]
  );

  // Rotación de valor de env vars EXISTENTES
  const [pendingValues, setPendingValues] = useState({});

  // Drafts de variables NUEVAS (no guardadas aún)
  const [draftVars, setDraftVars] = useState([]);

  const handleChangePendingValue = (id, value) => {
    setPendingValues((prev) => ({ ...prev, [id]: value }));
  };

  // --- EXISTENTES: guardar/borrar ----
  const handleSaveVar = (envVar) => {
    const value = pendingValues[envVar.id];
    if (!value) return;

    updateEnvVar.mutate(
      {
        pathParams: { id: envVar.id },
        req: {
          name: envVar.name,
          value,
        },
      },
      {
        onSuccess: () => {
          setPendingValues((prev) => ({ ...prev, [envVar.id]: "" }));
        },
      }
    );
  };

  const handleDeleteVar = (envVar) => {
    deleteEnvVar.mutate({
      pathParams: { id: envVar.id },
    });
  };

  // --- NUEVAS: drafts ----
  const handleAddDraft = () => {
    if (!envId) return;
    const tempId = `__new-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setDraftVars((prev) => [
      ...prev,
      { id: tempId, name: "", value: "" },
    ]);
  };

  const updateDraft = (id, patch) => {
    setDraftVars((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d))
    );
  };

  const handleSaveDraft = (draft) => {
    if (!envId || !draft.name || !draft.value) return;

    createEnvVar.mutate(
      {
        req: {
          env: envId,
          name: draft.name,
          value: draft.value,
        },
      },
      {
        onSuccess: () => {
          // eliminar draft, el listado real se refrescará por react-query
          setDraftVars((prev) => prev.filter((d) => d.id !== draft.id));
        },
      }
    );
  };

  const handleDeleteDraft = (id) => {
    setDraftVars((prev) => prev.filter((d) => d.id !== id));
  };

  const handleSubmit = () => {
    onRequestClose?.();
  };

  return (
    <EditForm
      title="envVars"
      inputList={[]} // no usamos inputs genéricos
      onSubmit={handleSubmit}
      onRequestClose={onRequestClose}
    >
      <div className="full-w column-left gap5">

        {!envId ? (
          <p className="muted">
            Esta app aún no tiene entorno (Env) asociado. Debería haberse creado
            automáticamente como ".env".
          </p>
        ) : (
          <p className="h4">{envForApp?.name || ".env"}</p>
        )}
      </div>

      {envId && (
        <div className="full-w column-left gap15">
          <div className="column-left gap5 full-w justify-between align-center">

            {/* Botón que crea un editor nuevo */}
            <button
              type="button"
              className="full-w center row gap10"
              onClick={handleAddDraft}
            >
              <img src="actions/add.svg" alt="add variables" className="icon" />
              <p className="h5">{t("addVar")}</p>
            </button>
          </div>

          {/* Drafts (nuevas vars) */}
          {draftVars.map((draft) => (
            <EnvVarEditor
              key={draft.id}
              envVar={{ id: draft.id, name: draft.name }}
              isNew
              pendingName={draft.name}
              pendingValue={draft.value}
              onChangeName={(name) => updateDraft(draft.id, { name })}
              onChangeValue={(val) => updateDraft(draft.id, { value: val })}
              onSave={() => handleSaveDraft(draft)}
              onDelete={() => handleDeleteDraft(draft.id)}
            />
          ))}

          {/* lista existente */}
          {envVars.length === 0 && draftVars.length === 0 && (
            <p className="muted">Este entorno aún no tiene variables.</p>
          )}

          {envVars.map((v) => (
            <EnvVarEditor
              key={v.id}
              envVar={v}
              pendingValue={pendingValues[v.id]}
              onChangeValue={(val) => handleChangePendingValue(v.id, val)}
              onSave={() => handleSaveVar(v)}
              onDelete={() => handleDeleteVar(v)}
            />
          ))}
        </div>
      )}
    </EditForm>
  );
}
