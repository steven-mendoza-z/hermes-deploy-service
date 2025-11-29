import { useState } from "react";
import { Link } from "react-router-dom";

export function SidebarLayout({ elements, className = '' }) {
  const [open, setOpen] = useState(false);
  
  return (
    <>
      <div className={`sidebar ${className}`}>
        {elements.map((element, index) => (
          <div key={index}>
            <div className="sidebar-element short">
              <Link to={element.url}>
                <img src={element.icon} alt={element.name} className="icon" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* <div
        className={`close-sidebar-button ${open ? "open" : ""}`}
        onClick={() => setOpen(false)}
      /> */}
    
    
      {/* <div className={`floating-sidebar ${open ? "open" : ""}`}>
        <button className="burger-menu" onClick={() => setOpen(false)}> 
          <img src="/burger_menu.svg" alt="menu" className="icon"/> 
        </button>  

        <div className="elements">
          {open && elements.map((element, index) => (
            <div key={index} className="sidebar-element expanded">
              <Link to={element.url} className="element-content">
                <img src={element.icon} alt={element.name} className="icon"/>
                <p>{element.name}</p>
              </Link>
            </div>
          ))}
        </div>
    </div> */}

    </>
  );
}

export default SidebarLayout;
