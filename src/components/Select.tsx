import { FiChevronDown } from "react-icons/fi";
import * as SelectPrimitive from "@radix-ui/react-select";
interface SelectProps {
  onChange: (value: string) => void;
  defaultValue?: { label: string; value: string };
  ariaLabel: string;
  value: string;
}

export const Select: React.FC<SelectProps> = ({
  defaultValue,
  onChange,
  children,
  ariaLabel,
  value,
}) => {
  return (
    <div className="relative text-base sm:text-lg divide-y-2">
      <SelectPrimitive.Root
        defaultValue={defaultValue.value}
        onValueChange={onChange}
        value={value}
      >
        <SelectPrimitive.Trigger
          aria-label={ariaLabel}
          className="button background-hover w-max hover:scale-105 gap-2"
        >
          <SelectPrimitive.Value />
          <SelectPrimitive.Icon>
            <FiChevronDown />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Content className="dark:bg-primary-green bg-slate-200 p-1 w-max rounded shadow-lg flex flex-col items-start text-sm">
          <SelectPrimitive.ScrollUpButton />
          <SelectPrimitive.Viewport>
            <SelectPrimitive.Group>{children}</SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton />
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
    </div>
  );
};

export const SelectOption: React.FC<{ label: string; value: string }> = ({ label, value }) => {
  return (
    <SelectPrimitive.Item value={value} className="p-2 cursor-pointer rounded bg-hover">
      <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
};
