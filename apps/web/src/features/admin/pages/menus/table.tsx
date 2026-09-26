import { useSelector } from "react-redux";
import TableCustom from "../../../../components/common/table.custom";
import MenuForm from "./form";

type Menu = {
  _id: string;
  name: string;
  desc: string;
  image?: string;
  price: number;
  promo?: number;
  duration?: number;
  category_name?: string;
  isAvailable?: boolean;
  isFavorite?: boolean;
};
type MenusState = { data?: Menu[]; loading: boolean };

const MenuTable = () => {
  const menus = useSelector((state: { Menus: MenusState }) => state.Menus);
  if (!menus.data) return null;

  const columns = [
    { id: "name", numeric: false, disablePadding: true, label: "Name" },
    { id: "desc", numeric: false, disablePadding: false, label: "Description" },
    {
      id: "image",
      numeric: false,
      disablePadding: false,
      label: "Image",
      cell: (menu: Menu) => (
        <img height="56px" width="76px" alt={menu.name} src={menu.image} />
      ),
    },
    { id: "price", numeric: false, disablePadding: true, label: "Price" },
    { id: "promo", numeric: false, disablePadding: false, label: "Promo" },
    {
      id: "duration",
      numeric: false,
      disablePadding: false,
      label: "Duration",
      cell: (menu: Menu) => (
        <div>{menu.duration ? `${menu.duration} Minute` : "0 Minute"}</div>
      ),
    },
    {
      id: "category_name",
      numeric: false,
      disablePadding: false,
      label: "Categories",
    },
    {
      id: "isAvailable",
      numeric: false,
      disablePadding: false,
      label: "Available",
      cell: (menu: Menu) => (
        <div>{menu.isAvailable ? "Tersedia" : "Tidak Tersedia"}</div>
      ),
    },
    {
      id: "isFavorite",
      numeric: false,
      disablePadding: false,
      label: "Favorite",
      cell: (menu: Menu) => (
        <div>{menu.isFavorite ? "Dataset" : "Tidak Dataset"}</div>
      ),
    },
  ];

  return (
    <div>
      <TableCustom
        title="Menus"
        columns={columns}
        rows={menus.data}
        loading={menus.loading}
        add
        update
        remove
        no
      />
      <MenuForm />
    </div>
  );
};

export default MenuTable;
