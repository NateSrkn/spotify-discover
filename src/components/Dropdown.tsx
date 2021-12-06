import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";

export const DropdownItem: React.FC<DropdownPrimitive.DropdownMenuItemProps> = ({
  children,
  ...props
}) => {
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.stopPropagation();
    if (props.onClick) {
      props.onClick(e);
    }
  }
  return (
    <DropdownPrimitive.Item
      className="flex content-center p-1 hover:bg-dark hover:bg-opacity-20 cursor-pointer rounded"
      {...props}
      onClick={handleClick}
    >
      {children}
    </DropdownPrimitive.Item>
  );
};

export const DropdownContent: React.FC<DropdownPrimitive.DropdownMenuContentProps> = ({
  children,
  ...props
}) => {
  return (
    <DropdownPrimitive.Content
      className="dark:bg-green-custom rounded p-1 text-sm bg-gray-100 hover:bg-opacity-50"
      {...props}
    >
      {children}
    </DropdownPrimitive.Content>
  );
};
