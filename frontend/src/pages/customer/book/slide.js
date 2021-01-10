import React from "react";
import SlideCustom from "./../../../components/common/slides.custom";
import Images from "./../../../assets/images";

const Slide = () => {
  const banner = [
    Images.banner_1,
    Images.banner_2,
    Images.banner_3,
    Images.banner_4,
    Images.banner_5,
    Images.banner_6,
  ];

  return (
    <>
      <SlideCustom data={banner} />
    </>
  );
};

export default Slide;
