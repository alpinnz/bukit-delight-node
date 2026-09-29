import type { HTMLAttributes } from "react";
import { useEffect } from "react";
type ContainerCustomProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
};

const ContainerCustom = ({
  title,
  maxWidth = "xl",
  children,
  ...props
}: ContainerCustomProps) => {
  useEffect(() => {
    document.title = `${title || ""}`;
  }, [title]);

  return (
    <main
      className={`mx-auto min-h-screen w-full px-4 sm:px-6 lg:px-8 ${
        {
          xs: "max-w-sm",
          sm: "max-w-2xl",
          md: "max-w-4xl",
          lg: "max-w-6xl",
          xl: "max-w-7xl",
        }[maxWidth]
      }`}
      {...props}
    >
      {children}
    </main>
  );
};

export default ContainerCustom;
