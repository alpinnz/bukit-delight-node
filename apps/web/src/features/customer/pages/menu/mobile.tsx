import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import ContainerBase from "../../../../components/common/container.customer.base";
import CategoryBanner from "../../components/category-banner";
import MenuList from "../../components/menu-list";
import MenuDialog from "../../components/menu-dialog";

type MenuInCategory = {
  _id?: string;
  id_category: { _id: string };
  name: string;
  image: string;
  price: number;
  promo: number;
  favorite?: number;
};

type Category = {
  _id: string;
  name: string;
  image?: string | null;
};

type MenuPageState = {
  Menus: { data: MenuInCategory[] };
  Categories: { data: Category[] };
};

const CustomerCategoryMenuPage = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const menus = useSelector((state: MenuPageState) => state.Menus.data);
  const category = useSelector((state: MenuPageState) =>
    state.Categories.data.find((entry) => entry._id === categoryId),
  );
  const categoryMenus = menus.filter(
    (menu) => menu.id_category._id === categoryId,
  );

  return (
    <ContainerBase type="menu" title={category ? category.name : ""}>
      <CategoryBanner image={category ? category.image : null} />
      <MenuList data={categoryMenus} />
      <MenuDialog />
    </ContainerBase>
  );
};

export default CustomerCategoryMenuPage;
