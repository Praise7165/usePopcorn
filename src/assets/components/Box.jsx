import { useState } from "react";

export default function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  function handleToggle() {
    setIsOpen((open) => !open);
  }

  return (
    <div className="box">
      <ToggleButton isOpen={isOpen} handleToggle={handleToggle} />
      {/* PASSING ELEMENT AS PROPS:  We can explicitly use element to render a specific element 
      {isOpen && element} as we can see implicitly passing using children props is the most preferred ways to handle prop drilling
      */}
      {isOpen && children}
    </div>
  );
}

function ToggleButton({ isOpen, handleToggle }) {
  return (
    <button className="btn-toggle" onClick={handleToggle}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
