import LoadingIndicator from "../../../components/atoms/loading-indicator";

type CategoryBannerProps = {
  image?: string | null;
};

const CategoryBanner = ({ image }: CategoryBannerProps) => (
  <div className="mx-2 flex h-[104px] items-center justify-center">
    {image ? (
      <img
        className="h-[104px] w-full rounded-lg object-cover"
        src={image}
        alt="banner-menu"
      />
    ) : (
      <LoadingIndicator className="text-brand-primary" />
    )}
  </div>
);

export default CategoryBanner;
