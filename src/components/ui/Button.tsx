import * as React from "react"

const buttonVariants = {
    primary: "bg-[var(--color-primary)] text-white hover:bg-[#153e32] shadow-sm",
    secondary: "bg-[var(--color-secondary)] text-white hover:bg-[#254073] shadow-sm",
    accent: "bg-[var(--color-accent)] text-white hover:bg-[#2b9086] shadow-sm",
    outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-muted)] text-[var(--color-foreground)]",
    ghost: "hover:bg-[var(--color-muted)] text-[var(--color-foreground)]",
    link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
}

const buttonSizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
}

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: keyof typeof buttonVariants
    size?: keyof typeof buttonSizes
    asChild?: boolean
    className?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className = "", variant = "primary", size = "default", asChild = false, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
