import { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
interface SelectProps {
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  defaultValue?: { label: string; value: string };
}
const Select = ({ options, onClick, defaultValue }) => {
  const [selected, setSelected] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = (option) => {
    onClick(option.value);
    setIsOpen(!isOpen);
    setSelected(option);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="relative" onBlur={() => setTimeout(toggleOpen, 100)}>
      <button
        onClick={toggleOpen}
        className="bg-gray-200 dark:bg-faded-green p-2 rounded-md text-lg font-medium"
      >
        <span className="flex gap-2 items-center">
          {selected.label}{" "}
          {isOpen ? <FiChevronUp size={17} /> : <FiChevronDown size={17} />}
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-full z-50 bg-gray-200 dark:bg-faded-green p-2 text-lg w-max rounded-md mt-2 shadow-lg flex flex-col items-start">
          {options
            .filter((option) => option.value !== selected.value)
            .map((option) => (
              <button
                key={option.value}
                onClick={() => handleClick(option)}
                className="hover:bg-gray-100 dark:hover:bg-green-custom w-full text-left p-1 rounded-sm"
              >
                {option.label}
              </button>
            ))}
        </div>
      )}

      {/* <select
      className="appearance-none flex flex-col relative bg-green-custom bg-opacity-20 text-xl px-3 py-2 rounded-md font-medium cursor-pointer"
      onChange={onChange}
    >
      {options
        .filter((option) => (selected ? option.value !== selected.value : true))
        .map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="appearance-none"
          >
            {option.label}
          </option>
        ))}
    </select> */}
    </div>
  );
};

export default Select;
