import { useState } from "react";
import { Link } from "react-router-dom";

export function BottombarLayout({ elements, className = "" }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={`bottombar ${className}`}>
        {elements.map((element, index) => (
          <div key={index} className="bottombar-element short">
            <Link to={element.url}>
              <img src={element.icon} alt={element.name} className="icon" />
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}

export default BottombarLayout;
