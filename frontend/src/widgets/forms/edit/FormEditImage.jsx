// src/views/deployments/forms/FormEditImage.jsx
import { useAppState } from "../../../context/AppStateContext.jsx";
import {
  useUpdateImage,
} from "../../../features/deployments/images/hooks.js";
import { useRepos } from "../../../features/deployments/repos/hooks.js";
import EditForm from "../components/EditForm.jsx";

export default function FormEditImage({ onRequestClose }) {
  const { formObject } = useAppState();

  const updateImage = useUpdateImage();
  const { data: repos = [] } = useRepos();
  const repoOptions = Array.isArray(repos)
    ? repos.map((r) => ({
        value: r.id,
        label: r.name,
      }))
    : [];

  const inputList = [
    { label: "name", valueKey: "name", validations: { required: true, minLength: 3 } },
    { label: "version", valueKey: "version", validations: { required: false } },
    { label: "url", valueKey: "url", validations: { required: true, type: "url" } },
    { label: "repository", valueKey: "repo", inputType: "select", options: repoOptions, validations: { required: true },},
    { label: "branch", valueKey: "branch", validations: { required: false } },
  ];

  const handleSubmit = () => {
    if (!formObject?.id) return;

    updateImage.mutate(
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
      title="image"
      inputList={inputList}
      onSubmit={handleSubmit}
      onRequestClose={onRequestClose}
    />
  );
}
