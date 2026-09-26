import SlideCustom from "../../../components/common/slides.custom";
import Images from "../../../assets/images";

const CustomerLaptopBanner = () => {
  const banners = [
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
        padding: "1vh 1vw",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <SlideCustom height="15vh" data={banners} />
    </div>
  );
};

export default CustomerLaptopBanner;
