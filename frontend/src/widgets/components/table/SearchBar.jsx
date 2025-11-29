// import { useAppState } from "../../../../../context/AppStateContext";

export function Searchbar() {
//   const { setForm } = useAppState();

//   const handleAdd = () => {
//     setForm("addLivestock");
//   };
  
  return (
    <div className="full-view searchbar">
        <input type="text" className="searchbar-input" placeholder="Search"/>
        <button className="searchbar-button">
            <img src="./search.png" alt="" className="icon"/>
        </button>
    </div>
  );
}


export default Searchbar;


