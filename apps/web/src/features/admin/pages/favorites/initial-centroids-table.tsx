import { useSelector } from "react-redux";
import TableCustom from "../../../../components/common/table.custom";

type InitialCentroid = {
  no: number;
  c: string;
  name_menu: string;
  x: number;
  y: number;
};
type FavoritesState = {
  data: { c_awal?: InitialCentroid[] } | null;
  loading: boolean;
};

const InitialCentroidsTable = () => {
  const favorites = useSelector(
    (state: { Favorites: FavoritesState }) => state.Favorites,
  );
  const rows = favorites.data?.c_awal;
  if (!rows) return null;

  const columns = [
    { id: "no", numeric: false, disablePadding: true, label: "No" },
    { id: "c", numeric: false, disablePadding: false, label: "C" },
    {
      id: "name_menu",
      numeric: false,
      disablePadding: false,
      label: "Name Menu",
    },
    { id: "x", numeric: false, disablePadding: false, label: "X" },
    { id: "y", numeric: false, disablePadding: false, label: "Y" },
  ];

  return (
    <TableCustom
      title="C Awal"
      columns={columns}
      rows={rows}
      loading={favorites.loading}
    />
  );
};

export default InitialCentroidsTable;
