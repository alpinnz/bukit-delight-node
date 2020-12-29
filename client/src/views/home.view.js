import * as React from "react";
import ListCardHorizontal from "./../components/list.card.horizontal";
import SlidesShow from "./../components/slides.show";
import ContainerBase from "./../components/container.base";

const HomeView = () => {
  const banner = [
    "/assets/images/banner-1.jpg",
    "/assets/images/banner-2.jpg",
    "/assets/images/banner-3.jpg",
    "/assets/images/banner-4.jpg",
    "/assets/images/banner-5.jpg",
    "/assets/images/banner-6.jpg",
  ];

  const tileData = [
    {
      img: "assets/images/banner-1.jpg",
      name: "title a",
      desc: "desc",
      price: 10000,
    },
    {
      img: "assets/images/banner-2.jpg",
      name: "title b",
      desc: "desc",
      price: 10000,
    },
    {
      img: "assets/images/banner-3.jpg",
      name: "title c",
      desc: "desc",
      price: 10000,
    },
  ];

  return (
    <ContainerBase navigationActive={2}>
      <SlidesShow data={banner} />
      <ListCardHorizontal title="Promo" data={tileData} />
      <ListCardHorizontal title="Recommended" data={tileData} />
    </ContainerBase>
  );
};

export default HomeView;
