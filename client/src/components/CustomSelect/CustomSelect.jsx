import React, { useState, useRef, useEffect } from "react";
import "../CustomSelect/CustomSelect.css";

// שולח את הערכים שצריך
const CustomSelect = ({
  options,
  onChange,
  placeholder,
  className,
  className2,
  error,
  value,
  forcePlaceholder = false,
}) => {
  //משתנים
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef();

  //עדכון הערך שנבחר
  useEffect(() => {
    setSelected(value);
  }, [value]);
  //במידה ויש אובייקט אז הוא יחבר את הלייבל ולאחר מכן יסגור את הרשימה
  const handleSelect = (option) => {
    setSelected(typeof option === "object" ? option.label : option);
    onChange && onChange(typeof option === "object" ? option.label : option);
    setIsOpen(false);
  };
  //בדיקה האם אני לוחץ מחוץ לרשימה בשביל לסגור אותה
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  //מוסיף לרשימה event של לחיצה לבדיקה
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={className} ref={ref}>
      <button
        style={{
          border: error ? "1px solid red" : "1px solid #ccc",
        }}
        className={className2}
        onClick={() => setIsOpen(!isOpen)}
      >
        {forcePlaceholder ? placeholder : selected || placeholder}
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <ul className="options-list">
          {options.map((option, index) => (
            <li
              key={index}
              className="option-item"
              onClick={() => handleSelect(option)}
            >
              {typeof option === "object" && option !== null
                ? option.label
                : option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;
