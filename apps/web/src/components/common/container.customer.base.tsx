import type { ReactNode } from "react";
import BottomNavigationCustom from "./buttom.navigation.custom";
import AppBar from "./app.bar";
import Images from "../../assets/images";

type CustomerContainerMode = "menu" | "book";
type ContainerCustomerBaseProps = {
  navigationActive?: number;
  type?: CustomerContainerMode;
  children?: ReactNode;
  title?: string;
};

const ContainerCustomerBase = ({
  navigationActive,
  type,
  children,
  title,
}: ContainerCustomerBaseProps) => {
  const appBarHeight = 60;

  return (
    <div
      style={{
        paddingTop: type ? appBarHeight : 0,
        paddingBottom: 56,
        backgroundColor: "#CCC1C1",
        minHeight: "100vh",
      }}
    >
      {children}
      {type === "menu" && (
        <AppBar title={title} routeName="/customer/book" hight={appBarHeight} />
      )}
      {type === "book" && (
        <div
          style={{
            padding: "0.25rem",
            position: "fixed",
            backgroundColor: "#CCC1C1",
            height: appBarHeight,
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
            top: 0,
            right: 0,
            left: 0,
          }}
        >
          <img
            style={{ width: "70%", height: 52.5 }}
            src={Images.banner_book}
            alt="banner-book"
          />
        </div>
      )}
      <BottomNavigationCustom selected={navigationActive} />
    </div>
  );
};

export default ContainerCustomerBase;
