import PromotionalCarousel from "./promotional-carousel";
import CustomerLayout from "../../../../components/templates/customer/layout";
import HorizontalMenuList from "./horizontal-menu-list";
import MenuDialog from "../../components/menu-dialog";
import { useSelector } from "react-redux";

type CustomerMenu = {
  id?: string;
  name: string;
  title?: string;
  image: string;
  price: number;
  promo: number;
  favorite?: boolean;
  [key: string]: unknown;
};

type CustomerHomeState = {
  Menus: { data: CustomerMenu[] };
};

const CustomerMobileHomePage = () => {
  const menus = useSelector((state: CustomerHomeState) => state.Menus.data);
  const menuPromo = menus.filter((menu) => menu.promo > 0);
  const menuFavorite = menus.filter((menu) => menu.favorite === true);

  return (
    <CustomerLayout>
      <PromotionalCarousel />
      <HorizontalMenuList title="Promo" data={menuPromo} />
      <HorizontalMenuList title="Favorites" data={menuFavorite} />
      <MenuDialog />
    </CustomerLayout>
  );
};

export default CustomerMobileHomePage;
