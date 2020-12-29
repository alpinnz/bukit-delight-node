import * as React from "react";
import BottomNavigationCustom from "./buttom.navigation.custom";
import useWindowDimensions from "./../components/hooks/useWindowDimensions";
import AppBarMenu from "./customer/menu/app.bar";

const ContainerBase = ({
  navigationActive,
  type,
  children,
  title,
  paddingTop,
}) => {
  const { height } = useWindowDimensions();
  const AppBarHight = 60;
  return (
    <div
      style={{
        position: "",
        paddingTop: type ? AppBarHight : 0,
        paddingBottom: 56,
        backgroundColor: "#CCC1C1",
        minHeight: height,
      }}
    >
      {children}
      {type === "menu" ? (
        <AppBarMenu title={title} routeName={"/book"} hight={AppBarHight} />
      ) : (
        <div />
      )}
      {type === "home" ? (
        <div
          style={{
            padding: "0.25rem",
            position: "fixed",
            backgroundColor: "#CCC1C1",
            height: AppBarHight,
            justifyContent: "center",
            textAlign: "center",
            alignItems: "center",
            top: 0,
            right: 0,
            left: 0,
          }}
        >
          <img
            style={{
              width: "70%",
              height: 52.5,
            }}
            src={"/assets/images/banner-book.jpg"}
            alt={"banner-book"}
          />
        </div>
      ) : (
        <div />
      )}
      <BottomNavigationCustom selected={navigationActive} />
    </div>
  );
};

export default ContainerBase;
