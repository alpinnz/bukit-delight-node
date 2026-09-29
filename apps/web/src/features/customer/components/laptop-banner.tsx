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
    <div className="relative flex h-[20vh] items-center justify-center bg-brand-accent px-[1vw] py-[1vh]">
      <SlideCustom height="15vh" data={banners} />
    </div>
  );
};

export default CustomerLaptopBanner;
