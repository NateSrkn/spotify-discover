// Define a generic type for the props
import React, { ComponentProps, ElementType, HTMLAttributes } from "react";

export type DynamicComponentProps<T extends ElementType = "div"> = {
  as?: T;
} & HTMLAttributes<T> &
  ComponentProps<T>;

export const DynamicComponent = <T extends ElementType = "div">({
  as,
  ...rest
}: DynamicComponentProps<T>) => {
  const Tag = as || ("div" as T);
  return <Tag {...rest} />;
};
