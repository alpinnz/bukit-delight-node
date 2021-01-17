import React from "react";
import Slide from "./slide";
import ContainerBase from "./../../../components/common/container.customer.base";
import ListHorizontal from "./list.horizontal";
import MenuDialog from "./../menu/menu.dialog";
import { useSelector } from "react-redux";

const MobilePage = () => {
  const Menus = useSelector((state) => state.Menus);
  const menu_promo = Menus.data.filter((e) => e.promo > 0);

  return (
    <ContainerBase navigationActive={2}>
      <Slide />
      <ListHorizontal title="Promo" data={menu_promo} />
      <ListHorizontal title="Recommended" data={menu_promo} />
      <MenuDialog />
    </ContainerBase>
  );
};

export default MobilePage;
