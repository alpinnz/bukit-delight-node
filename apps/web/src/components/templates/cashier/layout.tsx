import { useEffect, type ReactNode } from "react";
import AppBar from "../../molecules/app-bar";
import CashierTopTabs from "./top-tabs";

type CashierLayoutProps = {
  children?: ReactNode;
  title: string;
};

const CashierLayout = ({ children, title }: CashierLayoutProps) => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className="relative min-h-screen">
      <AppBar title="Cashier" />
      <CashierTopTabs />
      {children}
    </div>
  );
};

export default CashierLayout;
