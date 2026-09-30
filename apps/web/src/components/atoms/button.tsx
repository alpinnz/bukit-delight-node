import type { ButtonHTMLAttributes, ReactNode } from "react";
import LoadingIndicator from "./loading-indicator";

type ButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  loading?: boolean;
  label?: ReactNode;
  fullWidth?: boolean;
};

const Button = ({
  style,
  loading = false,
  disabled = false,
  label,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) => (
  <button
    {...props}
    type={props.type ?? "button"}
    disabled={disabled || loading}
    style={style}
    className={`inline-flex min-h-10 items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 ${fullWidth ? "w-full" : ""} ${className}`}
  >
    {loading ? <LoadingIndicator /> : (label ?? "label")}
  </button>
);

export default Button;
