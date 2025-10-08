import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hash-purple focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-hash-purple hover:bg-hash-purple/90 text-white shadow-lg hover:shadow-xl shadow-hash-purple/25",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-hash-purple/30 bg-white/50 backdrop-blur-sm hover:bg-hash-purple/10 hover:border-hash-purple text-black hover:text-hash-purple shadow-md hover:shadow-lg hover:shadow-hash-purple/20",
        secondary:
          "bg-white/50 backdrop-blur-sm text-black hover:bg-hash-blue/10 hover:text-hash-blue border border-black hover:border-hash-blue/30 shadow-md hover:shadow-lg",
        ghost: "hover:bg-hash-purple/10 hover:text-hash-purple transition-colors",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-3",
        sm: "h-9 rounded-lg px-4 py-2 text-xs",
        lg: "h-12 rounded-xl px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }
