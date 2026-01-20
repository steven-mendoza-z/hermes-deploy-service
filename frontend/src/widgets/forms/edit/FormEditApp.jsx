// src/views/deployments/forms/FormEditApp.jsx
import { useAppState } from "../../../context/AppStateContext.jsx";
import {
  useUpdateApp,
} from "../../../features/deployments/apps/hooks.js";
import { useRepos } from "../../../features/deployments/repos/hooks.js";
import { useServers } from "../../../features/deployments/servers/hooks.js";
import EditForm from "../components/EditForm.jsx";

export default function FormEditApp({ onRequestClose }) {
  const { formObject } = useAppState();
  const updateApp = useUpdateApp();

  const { data: repos = [] } = useRepos();
  const repoOptions = Array.isArray(repos)
    ? repos.map((r) => ({
        value: r.id,
        label: r.name,
      }))
    : [];
  const { data: servers = [] } = useServers();
  const serverOptions = servers.map((s) => ({
    value: s.id,
    label: s.name || s.ip,
  }));


  const inputList = [
    { label: "name", valueKey: "name", validations: { required: true, minLength: 3 } },
    { label: "domain", valueKey: "domain", validations: { required: true } },
    { label: "repository", valueKey: "repo", inputType: "select", options: repoOptions, required: true , validations: { required: true },},
    { label: "branch", valueKey: "branch", validations: { required: true } },
    { label: "server", valueKey: "server", inputType: "select", required: true, options: serverOptions },
  ];

  const handleSubmit = () => {
    if (!formObject?.id) return;

    updateApp.mutate(
      {
        pathParams: { id: formObject.id },
        req: formObject,
      },
      {
        onSuccess: () => {
          onRequestClose?.();
        },
      }
    );
  };

  return (
    <EditForm
      title="app"
      inputList={inputList}
      onSubmit={handleSubmit}
      onRequestClose={onRequestClose}
    />
  );
}
