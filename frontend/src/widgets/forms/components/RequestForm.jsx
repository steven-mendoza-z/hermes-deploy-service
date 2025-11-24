import { useAppState } from "../../../context/AppStateContext";

export function RequestForm({ title, button_str, children, onSubmit }) {

  const onSubmitHandler = (e) => {
    e.preventDefault();
    onSubmit(e);            
  };

  return (
    <form onSubmit={onSubmitHandler} className="full-view flex column-left requestForm">
      <h3 className="h4">{title}</h3>
      
      <div className="full-view column-left requestForm-content gap20">
        {children}
      </div>

      <div className="full-w row-right">
        <button type="submit" className="h5">{button_str}</button>
      </div>
    </form>
  );
}

export default RequestForm;
