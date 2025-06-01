import React from "react";
import { cn } from "../lib/utils";
import { useResponsive } from "../hooks/useResponsive";

interface ResponsiveCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
}

export function ResponsiveCard({
  children,
  className,
  padding = "md",
  variant = "default",
}: ResponsiveCardProps) {
  const { isMobile, isTablet } = useResponsive();

  const paddingClasses = {
    sm: isMobile ? "p-3" : "p-4",
    md: isMobile ? "p-4" : isTablet ? "p-5" : "p-6",
    lg: isMobile ? "p-5" : isTablet ? "p-6" : "p-8",
  };

  const variantClasses = {
    default: "bg-card border border-border shadow-sm",
    outline: "border border-border",
    ghost: "bg-transparent",
  };

  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200",
        variantClasses[variant],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// Responsive button component
interface ResponsiveButtonProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost" | "destructive";
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function ResponsiveButton({
  children,
  className,
  size = "md",
  variant = "default",
  fullWidth = false,
  onClick,
  disabled = false,
}: ResponsiveButtonProps) {
  const { isMobile } = useResponsive();

  const sizeClasses = {
    sm: isMobile ? "px-3 py-2 text-sm" : "px-4 py-2 text-sm",
    md: isMobile ? "px-4 py-2.5 text-base" : "px-6 py-2.5 text-base",
    lg: isMobile ? "px-5 py-3 text-lg" : "px-8 py-3 text-lg",
  };

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline:
      "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive:
      "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Responsive input component
interface ResponsiveInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  type?: "text" | "email" | "password" | "number" | "search";
  disabled?: boolean;
  fullWidth?: boolean;
}

export function ResponsiveInput({
  placeholder,
  value,
  onChange,
  className,
  type = "text",
  disabled = false,
  fullWidth = false,
}: ResponsiveInputProps) {
  const { isMobile } = useResponsive();

  const sizeClasses = isMobile
    ? "px-3 py-2.5 text-base"
    : "px-4 py-2.5 text-sm";

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      className={cn(
        "flex rounded-md border border-border bg-background ring-offset-background",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        sizeClasses,
        fullWidth && "w-full",
        className
      )}
    />
  );
}

// Responsive text component
interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  variant?: "h1" | "h2" | "h3" | "h4" | "body" | "caption" | "small";
  weight?: "normal" | "medium" | "semibold" | "bold";
  color?: "default" | "muted" | "accent" | "destructive";
}

export function ResponsiveText({
  children,
  className,
  variant = "body",
  weight = "normal",
  color = "default",
}: ResponsiveTextProps) {
  const { isMobile } = useResponsive();

  const variantClasses = {
    h1: isMobile ? "text-2xl" : "text-4xl",
    h2: isMobile ? "text-xl" : "text-3xl",
    h3: isMobile ? "text-lg" : "text-2xl",
    h4: isMobile ? "text-base" : "text-xl",
    body: isMobile ? "text-sm" : "text-base",
    caption: isMobile ? "text-xs" : "text-sm",
    small: "text-xs",
  };

  const weightClasses = {
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
  };

  const colorClasses = {
    default: "text-foreground",
    muted: "text-muted-foreground",
    accent: "text-accent-foreground",
    destructive: "text-destructive",
  };

  const Component = variant.startsWith("h")
    ? (variant as keyof JSX.IntrinsicElements)
    : "p";

  return (
    <Component
      className={cn(
        variantClasses[variant],
        weightClasses[weight],
        colorClasses[color],
        className
      )}
    >
      {children}
    </Component>
  );
}
