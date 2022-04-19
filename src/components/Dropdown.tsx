import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";

export const Dropdown: React.FC<DropdownPrimitive.DropdownMenuRootContentProps> = ({
  children,
  ...rest
}) => {
  return <DropdownPrimitive.Root {...rest}>{children}</DropdownPrimitive.Root>;
};

export const Trigger: React.FC<DropdownPrimitive.DropdownMenuTriggerProps> = ({
  children,
  ...rest
}) => {
  return <DropdownPrimitive.Trigger {...rest}>{children}</DropdownPrimitive.Trigger>;
};

export const Content: React.FC<DropdownPrimitive.DropdownMenuContentProps> = ({
  children,
  ...rest
}) => {
  return (
    <DropdownPrimitive.Content
      className="primary-bg rounded shadow-lg border secondary-border text-sm w-32"
      {...rest}
    >
      {children}
    </DropdownPrimitive.Content>
  );
};

export const Label: React.FC<DropdownPrimitive.MenuLabelProps> = ({ children, ...rest }) => {
  return (
    <DropdownPrimitive.Label
      className="px-4 py-1 flex items-center justify-between text-xs"
      {...rest}
    >
      {children}
    </DropdownPrimitive.Label>
  );
};

export const Item: React.FC<DropdownPrimitive.DropdownMenuItemProps> = ({ children, ...rest }) => {
  return (
    <DropdownPrimitive.Item
      {...rest}
      className="px-4 py-1 flex items-center justify-between bg-reverse-hover cursor-pointer"
    >
      {children}
    </DropdownPrimitive.Item>
  );
};
export const Checkbox: React.FC<DropdownPrimitive.DropdownMenuCheckboxItemProps> = ({
  children,
  ...rest
}) => {
  return (
    <DropdownPrimitive.CheckboxItem
      {...rest}
      className="px-4 py-1 flex items-center justify-between bg-hover cursor-pointer bg-reverse-hover"
    >
      {children}
    </DropdownPrimitive.CheckboxItem>
  );
};

export const Separator: React.FC<DropdownPrimitive.DropdownMenuSeparatorProps> = ({}) => {
  return <DropdownPrimitive.Separator className="border-t secondary-border" />;
};
