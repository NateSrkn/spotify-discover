"use client";
import { HTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

export type ButtonVariantProps = VariantProps<typeof button>;
export const button = cva(
  "w-max cursor-pointer flex disabled:cursor-not-allowed items-center justify-center",
  {
    variants: {
      intent: {
        primary:
          "bg-spotify/10 text-spotify/75 hover:text-spotify transition-all",
        secondary:
          "rounded-full border border-spotify/30 text-spotify hover:border-spotify transition-colors",
      },
      padding: {
        true: "px-4 py-2 rounded-xl",
        false: null,
      },
    },
    defaultVariants: {
      intent: "primary",
      padding: true,
    },
  },
);

type ButtonProps = ButtonVariantProps & HTMLAttributes<HTMLButtonElement>;

export const Button = (props: ButtonProps) => {
  const { children, className, intent, padding, ...rest } = props;
  return (
    <button className={button({ intent, padding, className })} {...rest}>
      {children}
    </button>
  );
};
