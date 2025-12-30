import React from "react";

type InputSize = "sm" | "md" | "lg";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helper?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  variant?: "default" | "ghost";
  size?: InputSize;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helper,
      error,
      icon,
      iconPosition = "left",
      variant = "default",
      size = "md",
      className = "",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "w-full font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary/50";

    const variantStyles = {
      default:
        "bg-white dark:bg-surface-dark border border-border-light dark:border-border-dark placeholder-gray-400 dark:placeholder-gray-500",
      ghost:
        "bg-surface-light dark:bg-surface-dark/50 border border-transparent",
    };

    const sizeStyles = {
      sm: "px-3 py-2 text-sm rounded-md",
      md: "px-4 py-3 text-base rounded-lg",
      lg: "px-5 py-4 text-lg rounded-xl",
    };

    const errorStyles = error
      ? "border-red-500 dark:border-red-400 focus:ring-red-500/50"
      : "";

    const inputClassName = `${baseStyles} ${variantStyles[variant]} ${
      sizeStyles[size]
    } ${errorStyles} ${
      icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : ""
    } ${className}`;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-text-main dark:text-gray-200 mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          <input ref={ref} className={inputClassName} {...props} />

          {icon && (
            <div
              className={`absolute top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none ${
                iconPosition === "left" ? "left-3" : "right-3"
              }`}
            >
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm font-medium text-red-500 dark:text-red-400">
            {error}
          </p>
        )}

        {helper && !error && (
          <p className="mt-1 text-sm text-text-sub dark:text-gray-400">
            {helper}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
