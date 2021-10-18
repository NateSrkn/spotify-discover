import React from "react";
interface IButton {
  children: React.ReactNode;
  onClick: () => void;
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
  [key: string]: any;
}

export const Button = ({
  children,
  onClick,
  icon: Icon,
  iconPosition = "left",
  ...rest
}: IButton) => {
  const handleClick = (event) => {
    event.stopPropagation();
    onClick();
  };
  return (
    <button
      className="button background-hover w-max hover:scale-105"
      onClick={handleClick}
      {...rest}
    >
      {Icon && iconPosition === "left" ? <Icon className="mr-1 text-xl" /> : null}
      {children}
      {Icon && iconPosition === "right" ? <Icon className="ml-1 text-xl" /> : null}
    </button>
  );
};
