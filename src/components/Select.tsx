import { FiChevronDown } from "react-icons/fi";
import * as SelectPrimitive from "@radix-ui/react-select";
interface SelectProps {
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  defaultValue?: { label: string; value: string };
  ariaLabel: string;
}

export const Select = ({ defaultValue, onChange, options, ariaLabel }: SelectProps) => {
  return (
    <div className="relative text-base sm:text-lg">
      <SelectPrimitive.Root defaultValue={defaultValue.value} onValueChange={onChange}>
        <SelectPrimitive.Trigger
          aria-label={ariaLabel}
          className="button background-hover w-max hover:scale-105 gap-2"
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon>
            <FiChevronDown />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Content className="dark:bg-faded-green bg-gray-100 p-1 w-max rounded shadow-lg flex flex-col items-start text-sm">
          <SelectPrimitive.ScrollUpButton />
          <SelectPrimitive.Viewport>
            <SelectPrimitive.Group>
              {options.map((option) => (
                <SelectPrimitive.Item
                  key={option.value}
                  value={option.value}
                  className="p-2 cursor-pointer rounded bg-hover"
                >
                  <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
    </div>
  );
};
