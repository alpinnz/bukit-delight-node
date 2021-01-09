import React from "react";
import ContainerBase from "./../../../components/common/container.customer.base";
import ListCardVertical from "./list.card.vertical";

const MobilePage = () => {
  return (
    <ContainerBase type="book" navigationActive={1}>
      <ListCardVertical />
    </ContainerBase>
  );
};

export default MobilePage;
