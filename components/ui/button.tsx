import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-br from-[#000000] to-[#3b3b3b] text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:from-[#5e5e5e] hover:to-[#3b3b3b] hover:-translate-y-0.5",
        secondary:
          "border border-[hsl(var(--border)/0.15)] bg-transparent text-foreground hover:bg-surface-highest/60",
        ghost: "text-foreground hover:bg-secondary",
        outline:
          "border border-[hsl(var(--border)/0.15)] bg-transparent text-foreground hover:bg-secondary"
      },
      size: {
        default: "h-11 px-5 py-2",
        lg: "h-12 px-6 py-3 text-base",
        sm: "h-9 px-4",
        xl: "h-14 px-8 py-4 text-base font-semibold"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
