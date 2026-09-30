import { useSelector } from "react-redux";
import ManagementTable from "../../../../components/organisms/management-table";

type FavoriteMenu = {
  no: number;
  name: string;
  desc?: string;
  image?: string;
  price: number;
  promo?: number;
  duration?: number;
  is_available?: boolean;
};
type FavoritesState = {
  data: { favorite_menus?: FavoriteMenu[] } | null;
  loading: boolean;
};

const FavoriteResultsTable = () => {
  const favorites = useSelector(
    (state: { Favorites: FavoritesState }) => state.Favorites,
  );
  const rows = favorites.data?.favorite_menus;
  if (!rows) return null;

  const columns = [
    { id: "name", numeric: false, disablePadding: true, label: "Name" },
    { id: "desc", numeric: false, disablePadding: false, label: "Description" },
    {
      id: "image",
      numeric: false,
      disablePadding: false,
      label: "Image",
      cell: (menu: FavoriteMenu) => (
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
      cell: (menu: FavoriteMenu) => (
        <div>{menu.duration ? `${menu.duration} Minute` : "0 Minute"}</div>
      ),
    },
    {
      id: "is_available",
      numeric: false,
      disablePadding: false,
      label: "Available",
      cell: (menu: FavoriteMenu) => (
        <div>{menu.is_available ? "Tersedia" : "Tidak Tersedia"}</div>
      ),
    },
  ];

  return (
    <ManagementTable
      title="Favorite Results"
      columns={columns}
      rows={rows}
      loading={favorites.loading}
      no
    />
  );
};

export default FavoriteResultsTable;
