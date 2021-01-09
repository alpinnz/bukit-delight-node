import React from "react";
import SlideCustom from "./../../../components/common/slides.custom";
import Images from "./../../../assets/images";

const Banner = () => {
  const banner = [
    Images.banner_1,
    Images.banner_2,
    Images.banner_3,
    Images.banner_4,
    Images.banner_5,
    Images.banner_6,
  ];
  return (
    <div
      style={{
        height: "20vh",
        position: "relative",
        backgroundColor: "#FFA472",
        paddingTop: "2vh",
        paddingLeft: "5vw",
        paddingRight: "5vw",
        paddingBottom: "5vh",
      }}
    >
      <SlideCustom height={"13vh"} data={banner} />
    </div>
  );
};

export default Banner;
