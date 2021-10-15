import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
interface SelectProps {
  options: Array<{ label: string; value: string }>;
  onClick: (value: string) => void;
  defaultValue?: { label: string; value: string };
}
export const Select = ({ options, onClick, defaultValue }: SelectProps) => {
  const [selected, setSelected] = useState(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  let timeout = null;
  const handleClick = (option) => {
    onClick(option.value);
    setIsOpen(!isOpen);
    setSelected(option);
  };

  const onBlurHandler = () => {
    timeout = setTimeout(() => setIsOpen(false));
  };

  const onFocusHandler = () => clearTimeout(timeout);

  return (
    <div
      className="relative text-base sm:text-lg"
      onBlur={onBlurHandler}
      onFocus={onFocusHandler}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="bg-gray-200 dark:bg-faded-green p-2 rounded-md  font-medium"
      >
        <span className="flex gap-2 items-center">
          {selected.label}{" "}
          {isOpen ? <FiChevronUp size={17} /> : <FiChevronDown size={17} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-full z-50 bg-gray-200 dark:bg-faded-green p-2 w-max rounded-md mt-2 shadow-lg flex flex-col items-start"
          >
            {options
              .filter((option) => option.value !== selected.value)
              .map((option) => (
                <motion.button
                  key={option.value}
                  onClick={() => handleClick(option)}
                  className="hover:bg-gray-100 dark:hover:bg-green-custom w-full text-left p-1 rounded-sm"
                >
                  {option.label}
                </motion.button>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
