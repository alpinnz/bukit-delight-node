import type { ReactNode } from "react";
import CustomerBottomNavigation from "../../../features/customer/components/bottom-navigation";
import AppBar from "../../molecules/app-bar";
import Images from "../../../assets/images";

type CustomerLayoutMode = "menu" | "book";
type CustomerLayoutProps = {
  type?: CustomerLayoutMode;
  children?: ReactNode;
  title?: string;
};

const CustomerLayout = ({
  type,
  children,
  title,
}: CustomerLayoutProps) => {
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
      <CustomerBottomNavigation />
    </div>
  );
};

export default CustomerLayout;
