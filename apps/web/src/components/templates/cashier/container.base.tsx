import { useEffect, type ReactNode } from "react";
import AppBar from "./app.bar";
import TopTabs from "./top.tabs";

type CashierContainerBaseProps = {
  children?: ReactNode;
  title: string;
};

const ContainerBase = ({ children, title }: CashierContainerBaseProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="relative min-h-screen">
      <AppBar title="Cashier" />
      <TopTabs />
      {children}
    </div>
  );
};

export default ContainerBase;
