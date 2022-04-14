import React, { HTMLAttributes } from "react";
import classNames from "classnames";
interface IButton {
  children: React.ReactNode;
  action: () => void;
  icon?: React.ElementType;
  iconPosition?: "left" | "right";
  className?: HTMLAttributes<HTMLButtonElement>["className"];
  [key: string]: any;
}

export const Button = ({
  children,
  action,
  icon: Icon,
  iconPosition = "left",
  className,
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
      className={classNames("button background-hover w-max hover:scale-105", className)}
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
