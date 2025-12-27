import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex justify-center items-center gap-1 px-2 py-0.5 border aria-invalid:border-destructive focus-visible:border-ring rounded-md aria-invalid:ring-destructive/20 focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:aria-invalid:ring-destructive/40 w-fit [&>svg]:size-3 overflow-hidden font-medium text-xs leading-normal whitespace-nowrap transition-[color,box-shadow] [&>svg]:pointer-events-none shrink-0",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "text-success-background border-success-foreground bg-success/10 [a&]:hover:bg-success-background/90 dark:text-success dark:bg-success-background dark:border-transparent",
        pending:
          "text-pending-background border-pending-foreground bg-pending/10 dark:border-transparent dark:bg-pending-background dark:text-pending [a&]:hover:bg-pending-background/90 ",
        reject:
          "dark:border-transparent dark:bg-muted-foreground dark:text-muted [a&]:hover:bg-muted-foreground/90",
        reset: ""
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
