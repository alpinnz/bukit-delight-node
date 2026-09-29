import { useEffect, type ReactNode } from "react";
import AppBar from "./app.bar";

type ContainerBaseProps = {
  children?: ReactNode;
  title: string;
};

const ContainerBase = ({ children, title }: ContainerBaseProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="relative min-h-screen">
      <AppBar title={title} />
      {children}
    </div>
  );
};

export default ContainerBase;
