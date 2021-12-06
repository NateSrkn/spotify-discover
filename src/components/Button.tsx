import React from "react";
interface IButton {
  children: React.ReactNode;
  action: () => void;
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
  [key: string]: any;
}

export const Button = ({
  children,
  action,
  icon: Icon,
  iconPosition = "left",
  ...rest
}: IButton) => {
  const handleClick = (event) => {
    event.stopPropagation();
    action();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };
  return (
    <button
      className="button background-hover w-max hover:scale-105"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      {...rest}
    >
      {Icon && iconPosition === "left" ? <Icon className="mr-1 text-xl" /> : null}
      {children}
      {Icon && iconPosition === "right" ? <Icon className="ml-1 text-xl" /> : null}
    </button>
  );
};
