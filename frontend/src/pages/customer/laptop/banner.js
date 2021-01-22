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
        paddingTop: "1vh",
        paddingLeft: "1vw",
        paddingRight: "1vw",
        paddingBottom: "1vh",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SlideCustom height={"15vh"} data={banner} />
    </div>
  );
};

export default Banner;
