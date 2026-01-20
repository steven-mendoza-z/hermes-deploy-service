// src/views/deployments/forms/SshCmd.jsx
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppState } from "../../../context/AppStateContext";

export function SshCmd({ onRequestClose }) {
  const { t } = useTranslation();
  const { formObject, isMobile } = useAppState();
  const [copied, setCopied] = useState(false);

  const handleExit = () => onRequestClose?.();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formObject?.setup_cmd || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // mensaje temporal
    } catch (err) {
      console.error("Error copying:", err);
    }
  };

  return (
    <div className="full-view column-left gap20 sshForm">

      <div className="full-w row-right">
        <button className="exit-button" onClick={handleExit}>
          <img src="actions/exit.svg" alt="copy command" className="icon"/>
        </button>
      </div>

      <p className="h3">{t("sshTitle")}</p>
      
      <div className="full-w column-left gap5">
        <p className="t-body3">{t("sshDescription1")}</p>
        
        <div className="row-right full-w">
          <button className="row gap5 hl1" onClick={handleCopy}>
            <img src="actions/copy.svg" alt="copy command" className="icon"/>
            <p>{copied ? t("copied") : t("copy")}</p>
          </button>
        </div>

        <p className="t-body3">{t("sshDescription2")}</p>
        
        <div className="row-right full-w">
          <button className="row gap5 hl1 setup-button" onClick={handleCopy}>
            <p>{t("setup")}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SshCmd;
