import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { Button } from ".";
import { useTimeout } from "../hooks";
interface SelectProps {
  options: Array<{ label: string; value: string }>;
  onClick: (value: string) => void;
  defaultValue?: { label: string; value: string };
}
export const Select = ({ options, onClick, defaultValue }: SelectProps) => {
  const [selected, setSelected] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const [handleSetTimeout, handleClearTimeout] = useTimeout();
  const handleClick = (option) => {
    onClick(option.value);
    setIsOpen(!isOpen);
    setSelected(option);
  };

  const onBlurHandler = () => handleSetTimeout(() => setIsOpen(false), null);
  const onFocusHandler = () => handleClearTimeout();

  return (
    <div className="relative text-base sm:text-lg" onBlur={onBlurHandler} onFocus={onFocusHandler}>
      <Button
        action={() => setIsOpen(!isOpen)}
        icon={isOpen ? FiChevronUp : FiChevronDown}
        iconPosition="right"
        aria-haspopup="true"
        aria-expanded={isOpen}
        style={{
          fontSize: "1rem",
        }}
      >
        {selected.label}
      </Button>

      {isOpen && (
        <div
          className="absolute top-full z-50 dark:bg-green-custom bg-gray-100 p-1 w-max rounded-md mt-2 shadow-lg flex flex-col items-start"
          style={{
            fontSize: "1rem",
          }}
        >
          {options
            .filter((option) => option.value !== selected.value)
            .map((option) => (
              <Button
                key={option.value}
                action={() => handleClick(option)}
                style={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  fontSize: "1rem",
                }}
              >
                {option.label}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
};
