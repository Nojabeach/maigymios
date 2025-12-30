import React from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      icon,
      iconPosition = "left",
      fullWidth = false,
      disabled = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-smooth focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]";

    const variantStyles = {
      primary:
        "bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary/40 active:scale-95",
      secondary:
        "bg-gradient-secondary text-white hover:shadow-lg hover:shadow-secondary/40 active:scale-95",
      accent:
        "bg-gradient-accent text-white hover:shadow-lg hover:shadow-accent/40 active:scale-95",
      ghost:
        "text-primary hover:bg-primary/10 dark:hover:bg-primary/20 active:scale-95",
      outline:
        "border-2 border-primary text-primary hover:bg-primary/5 dark:hover:bg-primary/10 active:scale-95",
    };

    const sizeStyles = {
      sm: "px-3 py-2 text-sm gap-2",
      md: "px-5 py-3 text-base gap-2",
      lg: "px-6 py-4 text-lg gap-3",
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${
      sizeStyles[size]
    } ${fullWidth ? "w-full" : ""} ${className}`;

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={combinedClassName}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {icon && iconPosition === "left" && <span>{icon}</span>}
        {children}
        {icon && iconPosition === "right" && <span>{icon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
