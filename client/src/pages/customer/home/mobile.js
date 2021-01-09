import React from "react";
import Slide from "./slide";
import ContainerBase from "./../../../components/common/container.customer.base";
import ListHorizontalCustom from "./list.horizontal.custom";
import Images from "./../../../assets/images";

const MobilePage = () => {
  const tileData = [
    {
      img: Images.banner_1,
      name: "title a",
      desc: "desc",
      price: 10000,
    },
    {
      img: Images.banner_2,
      name: "title b",
      desc: "desc",
      price: 10000,
    },
    {
      img: Images.banner_3,
      name: "title c",
      desc: "desc",
      price: 10000,
    },
  ];
  return (
    <ContainerBase navigationActive={2}>
      <Slide />
      <ListHorizontalCustom title="Promo" data={tileData} />
      <ListHorizontalCustom title="Recommended" data={tileData} />
    </ContainerBase>
  );
};

export default MobilePage;
