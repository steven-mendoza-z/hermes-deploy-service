// src/views/deployments/forms/FormAddImage.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import RequestForm from "../components/RequestForm.jsx";
import { ImageModel } from "../../../features/deployments/images/ImageModel.js";
import { useCreateImage } from "../../../features/deployments/images/hooks.js";

export function FormAddImage({ onRequestClose }) {
  const { t } = useTranslation();
  const [image, setImage] = useState(new ImageModel());
  const createImage = useCreateImage();

  const inputList = [
    { label: "name", valueKey: "name", validations: { required: true, minLength: 3 } },
    { label: "version", valueKey: "branch", validations: { required: false } },
    { label: "url", valueKey: "url", validations: { required: true, type: "url" } },
    { label: "repository", valueKey: "repository", validations: { required: false } },
    { label: "branch", valueKey: "branch", validations: { required: false } },
  ];

  const handleChange = (key, value) => {
    const updated = new ImageModel(image.toJSON());
    updated[key] = value;
    setImage(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createImage.mutate(
      { req: image.toAddPayload() },
      {
        onSuccess: () => {
          setImage(new ImageModel());
          onRequestClose?.();
        },
        onError: (err) => {
          console.error(err?.response?.data || err?.message);
        },
      }
    );
  };

  return (
    <RequestForm
      title={t("addImage")}
      button_str={t("submit")}
      inputList={inputList}
      formObject={image}
      setFormObject={setImage}
      handleChange={handleChange}
      onSubmit={handleSubmit}
    />
  );
}

export default FormAddImage;
