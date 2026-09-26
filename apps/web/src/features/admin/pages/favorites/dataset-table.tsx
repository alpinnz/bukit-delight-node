import { useSelector } from "react-redux";
import TableCustom from "../../../../components/common/table.custom";

type DatasetRow = { no: number; name_menu: string; x: number; y: number };
type FavoritesState = {
  data: { DataSet?: DatasetRow[] } | null;
  loading: boolean;
};

const DatasetTable = () => {
  const favorites = useSelector(
    (state: { Favorites: FavoritesState }) => state.Favorites,
  );
  const rows = favorites.data?.DataSet;
  if (!rows) return null;

  const columns = [
    { id: "no", numeric: false, disablePadding: true, label: "No" },
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
      title="DataSet"
      columns={columns}
      rows={rows}
      loading={favorites.loading}
    />
  );
};

export default DatasetTable;
