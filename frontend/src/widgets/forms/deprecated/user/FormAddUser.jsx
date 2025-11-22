import { useEffect, useMemo, useState } from "react";
import RequestForm from "../../components/RequestForm.jsx";
import { useTranslation } from "react-i18next";
import { useRols } from "../../../../features/accounts/users/entities.js";
import CustomInput from "../../components/CustomInput.jsx";
import CustomSelect from "../../components/CustomSelect.jsx";


export function FormAddUser() {
  const { t } = useTranslation();

    const [ email, setEmail ] = useState();
    const [ rol, setRols ] = useState();

    const {rols} = useRols();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("User:", { email, rol });
        // Aquí podrías llamar a tu hook de creación: useCreateUser().mutate({ email, rol })
    };

  return (
    <RequestForm
      title={t("addUser")}
      button_str={t("submit")}
      onSubmit={handleSubmit}
    >
        <div className="formSection">
     
        </div>

        <div className="card column-left full-w gap20">
            <p className="h4">Mandar invitacion por correo</p>
     
            <div className="formSection">
                <CustomInput
                label={t("email")}
                //   placeholder={t("birthdatePlaceholder")"},
                value={email}
                onChange={setEmail}
                type="email"
                required
                />
                <CustomSelect
                label={t("rol")}
                value={rol}
                onChange={setRols}
                options={rols}
                required
                />
            </div>
     
        </div>

        <div className="formSection full-w center"><p>{t("o")}</p></div>

        <div className="card column-left full-w gap20">
            <p className="h4">Copiar invitacion al portapapeles</p>
     
            <div className="flex row full-w center gap10">
                <CustomInput
                label={t("a")}
                placeholder={t("Copiar URL de la invitacion")}
                value={email}
                onChange={setEmail}
                type="email"
                />
                <CustomSelect
                label={t("rol")}
                value={rol}
                onChange={setRols}
                options={rols}
                required
                />
            </div>
     
        </div>

    </RequestForm>
  );
}
export default FormAddUser;
