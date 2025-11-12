import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:bg-black dark:hover:bg-white text-white dark:hover:text-black cursor-pointer transition-all duration-200 ease-in-out",
        destructive:
          "bg-red-500 text-white cursor-pointer hover:bg-red-500/90 focus-visible:ring-red-500/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 hover:outline-1 hover:outline-red-200 hover:outline-offset-2 dark:hover:outline-red-800",
        outline:
          "border border-zinc-200 dark:border-zinc-900 cursor-pointer hover:outline-1 hover:outline-zinc-200 hover:outline-offset-2 dark:hover:outline-zinc-800",
        secondary:
          "bg-secondary bg-zinc-100 dark:bg-zinc-900 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 hover:dark:text-zinc-100 hover:outline-1 outline-offset-2 hover:outline-zinc-200 dark:hover:outline-zinc-800 cursor-pointer",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50", 
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        "default": "h-9 px-4 py-2 has-[>svg]:px-3",
        "sm": "h-[30px] text-[13px] rounded-full gap-1.5 px-3 has-[>svg]:px-2.5",
        "lg": "h-10 rounded-full px-6 has-[>svg]:px-4",
        "icon": "size-9",
        "icon-sm": "size-[30px] flex items-center justify-center",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
