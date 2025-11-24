import { useEffect } from "react";
import { useAppState } from "../../../context/AppStateContext.jsx";
import { useUpdateServer } from "../../../features/deployments/servers/hooks.js";
import ActionsForm from "../components/ActionForm.jsx";

export default function FormActionsServer({ server }) { // server: objeto con los datos actuales
  const { formObject, setFormObject } = useAppState();
  const { mutateAsync: updateServer } = useUpdateServer(); // <--- usar mutateAsync

    const handleSubmit = async (data) => {
    try {
        if (!data.id) throw new Error("Missing server ID");

        console.log("Sending to updateServer:", data);

        const response = await updateServer({
        pathParams: { id: data.id },
        body: data
        });

        console.log("Server updated:", response);
    } catch (error) {
        console.error(error);
    }
    };


  const inputList = [
    { label: "name", valueKey: "name" },
    { label: "ipAddress", valueKey: "ip" },
    { label: "region", valueKey: "region" },
    { label: "email", valueKey: "email" },
    { label: "projectId", valueKey: "project" },
  ];

  return <ActionsForm title="server" inputList={inputList} onSubmit={handleSubmit} />;
}
