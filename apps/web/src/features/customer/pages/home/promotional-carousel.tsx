import ImageCarousel from "../../../../components/organisms/image-carousel";
import Images from "../../../../assets/images";

const PromotionalCarousel = () => {
  const banners: string[] = [
    Images.banner_1,
    Images.banner_2,
    Images.banner_3,
    Images.banner_4,
    Images.banner_5,
    Images.banner_6,
  ];

  return <ImageCarousel data={banners} />;
};

export default PromotionalCarousel;
