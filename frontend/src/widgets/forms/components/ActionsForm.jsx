import { useTranslation } from "react-i18next";
import { useAppState } from "../../../context/AppStateContext";

export default function ActionsForm({ actions }) {
  const { t } = useTranslation();

  return (
    <form className="full-view column-left gap10 actionsForm">
      <p className="h4 flex-center full-w">{t("Select an Action")}</p>

      <div className="full-view row flex-center gap10">
        {actions.map(({ label, icon, onClick, color }, index) => (
          <div
            key={label || index}
            className="column flex-center full-w gap10"
          >
            <button
              type="button"                            // 👈 no submit
              className={`action-button ${color || ""}`}
              onClick={(e) => {
                e.preventDefault();                   // 👈 evita submit
                if (onClick) onClick();              // 👈 AHORA SÍ se ejecuta
              }}
            >
              {icon && (
                <img className="icon" src={icon} alt={label} />
              )}
            </button>
            <p className="h5">{t(label)}</p>
          </div>
        ))}
      </div>
    </form>
  );
}
