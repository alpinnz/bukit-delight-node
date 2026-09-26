import { useEffect, type ReactNode } from "react";
import AppBar from "./app.bar";
import TopTabs from "./top.tabs";

type CashierContainerBaseProps = {
  children?: ReactNode;
  tabActive: number;
  title: string;
};

const ContainerBase = ({
  tabActive,
  children,
  title,
}: CashierContainerBaseProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <AppBar title="Kasir" />
      <TopTabs tabActive={tabActive} />
      {children}
    </div>
  );
};

export default ContainerBase;
