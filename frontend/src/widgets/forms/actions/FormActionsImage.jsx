// src/views/deployments/forms/FormActionsImage.jsx
import { useAppState } from "../../../context/AppStateContext.jsx";
import {
  useUpdateImage,
  useDeleteImage,
} from "../../../features/deployments/images/hooks.js";
import ActionsForm from "../components/ActionForm.jsx";

export default function FormActionsImage({ onRequestClose }) {
  const { formObject } = useAppState();

  const updateImage = useUpdateImage();
  const deleteImage = useDeleteImage();

  const inputList = [
    { label: "name", valueKey: "name" },
    { label: "version", valueKey: "branch" },
    { label: "url", valueKey: "url" },
    { label: "repository", valueKey: "repository" },
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

  const deleteImageFn = () => {
    if (!formObject?.id) return;

    deleteImage.mutate(
      { pathParams: { id: formObject.id } },
      {
        onSuccess: () => {
          onRequestClose?.();
        },
        onError: (err) => {
          console.error("Delete image failed:", err);
        },
      }
    );
  };

  return (
    <ActionsForm
      title="image"
      inputList={inputList}
      onSubmit={handleSubmit}
      onDelete={deleteImageFn}
      onRequestClose={onRequestClose}
    />
  );
}
