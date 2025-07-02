import React, { useState, useRef, useEffect } from "react";
import "../CustomSelect/CustomSelect.css";

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
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const ref = useRef();

  useEffect(() => {
    setSelected(value);
  }, [value]);

  const handleSelect = (option) => {
    setSelected(typeof option === "object" ? option.label : option);
    onChange && onChange(typeof option === "object" ? option.label : option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

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
