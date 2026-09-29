import Slide from "./slide";
import ContainerBase from "../../../../components/common/container.customer.base";
import ListHorizontal from "./list.horizontal";
import MenuDialog from "../../components/menu-dialog";
import { useSelector } from "react-redux";

type CustomerMenu = {
  _id?: string;
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

const MobilePage = () => {
  const menus = useSelector((state: CustomerHomeState) => state.Menus.data);
  const menuPromo = menus.filter((menu) => menu.promo > 0);
  const menuFavorite = menus.filter((menu) => menu.favorite === true);

  return (
    <ContainerBase title={undefined} type={undefined}>
      <Slide />
      <ListHorizontal title="Promo" data={menuPromo} />
      <ListHorizontal title="Favorites" data={menuFavorite} />
      <MenuDialog />
    </ContainerBase>
  );
};

export default MobilePage;
