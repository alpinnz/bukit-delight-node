import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import CustomerLayout from "../../../../components/templates/customer/layout";
import CategoryBanner from "../../components/category-banner";
import MenuList from "../../components/menu-list";
import MenuDialog from "../../components/menu-dialog";

type MenuInCategory = {
  id?: string;
  category_id: { id: string };
  name: string;
  image: string;
  price: number;
  promo: number;
  favorite?: number;
};

type Category = {
  id: string;
  name: string;
  image?: string | null;
};

type MenuPageState = {
  Menus: { data: MenuInCategory[] };
  Categories: { data: Category[] };
};

const CustomerCategoryMenuPage = () => {
  const { category_id: categoryId } = useParams<{ category_id?: string }>();
  const menus = useSelector((state: MenuPageState) => state.Menus.data);
  const category = useSelector((state: MenuPageState) =>
    state.Categories.data.find((entry) => entry.id === categoryId),
  );
  const categoryMenus = menus.filter(
    (menu) => menu.category_id.id === categoryId,
  );

  return (
    <CustomerLayout type="menu" title={category ? category.name : ""}>
      <CategoryBanner image={category ? category.image : null} />
      <MenuList data={categoryMenus} />
      <MenuDialog />
    </CustomerLayout>
  );
};

export default CustomerCategoryMenuPage;
