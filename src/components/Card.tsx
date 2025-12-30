import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined" | "ghost";
  padding?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "xl";
  clickable?: boolean;
  children: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "default",
      padding = "md",
      rounded = "lg",
      clickable = false,
      className = "",
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = "transition-smooth";

    const variantStyles = {
      default:
        "bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark",
      elevated: "bg-white dark:bg-surface-dark shadow-md dark:shadow-lg",
      outlined:
        "border-2 border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10",
      ghost:
        "bg-transparent border border-border-light dark:border-border-dark",
    };

    const paddingStyles = {
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    };

    const roundedStyles = {
      sm: "rounded-md",
      md: "rounded-lg",
      lg: "rounded-xl",
      xl: "rounded-2xl",
    };

    const clickableStyles = clickable
      ? "cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-95"
      : "";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${roundedStyles[rounded]} ${clickableStyles} ${className}`;

    return (
      <div ref={ref} className={combinedClassName} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
