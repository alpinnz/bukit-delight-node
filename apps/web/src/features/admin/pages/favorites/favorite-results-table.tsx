import { useSelector } from "react-redux";
import TableCustom from "../../../../components/common/table.custom";

type FavoriteMenu = {
  no: number;
  name: string;
  desc?: string;
  image?: string;
  price: number;
  promo?: number;
  duration?: number;
  isAvailable?: boolean;
};
type FavoritesState = {
  data: { menu_favorit?: FavoriteMenu[] } | null;
  loading: boolean;
};

const FavoriteResultsTable = () => {
  const favorites = useSelector(
    (state: { Favorites: FavoritesState }) => state.Favorites,
  );
  const rows = favorites.data?.menu_favorit;
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
      id: "isAvailable",
      numeric: false,
      disablePadding: false,
      label: "Available",
      cell: (menu: FavoriteMenu) => (
        <div>{menu.isAvailable ? "Tersedia" : "Tidak Tersedia"}</div>
      ),
    },
  ];

  return (
    <TableCustom
      title="Result Pemesanan"
      columns={columns}
      rows={rows}
      loading={favorites.loading}
      no
    />
  );
};

export default FavoriteResultsTable;
