import { useSelector } from "react-redux";
import ManagementTable from "../../../../components/organisms/management-table";

type DatasetRow = { no: number; menu_name: string; x: number; y: number };
type FavoritesState = {
  data: { data_set?: DatasetRow[] } | null;
  loading: boolean;
};

const DatasetTable = () => {
  const favorites = useSelector(
    (state: { Favorites: FavoritesState }) => state.Favorites,
  );
  const rows = favorites.data?.data_set;
  if (!rows) return null;

  const columns = [
    { id: "no", numeric: false, disablePadding: true, label: "No" },
    {
      id: "menu_name",
      numeric: false,
      disablePadding: false,
      label: "Name Menu",
    },
    { id: "x", numeric: false, disablePadding: false, label: "X" },
    { id: "y", numeric: false, disablePadding: false, label: "Y" },
  ];

  return (
    <ManagementTable
      title="Dataset"
      columns={columns}
      rows={rows}
      loading={favorites.loading}
    />
  );
};

export default DatasetTable;
