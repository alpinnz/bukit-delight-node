import type { ReactNode } from "react";
import BottomNavigationCustom from "./buttom.navigation.custom";
import AppBar from "./app.bar";
import Images from "../../assets/images";

type CustomerContainerMode = "menu" | "book";
type ContainerCustomerBaseProps = {
  type?: CustomerContainerMode;
  children?: ReactNode;
  title?: string;
};

const ContainerCustomerBase = ({
  type,
  children,
  title,
}: ContainerCustomerBaseProps) => {
  return (
    <div
      className={`min-h-screen bg-surface-customer pb-14 ${type ? "pt-[60px]" : "pt-0"}`}
    >
      {children}
      {type === "menu" && (
        <AppBar title={title} routeName="/customer/book" height={60} />
      )}
      {type === "book" && (
        <div className="fixed inset-x-0 top-0 flex h-[60px] items-center justify-center bg-surface-customer p-1 text-center">
          <img
            className="h-[52.5px] w-[70%]"
            src={Images.banner_book}
            alt="banner-book"
          />
        </div>
      )}
      <BottomNavigationCustom />
    </div>
  );
};

export default ContainerCustomerBase;
