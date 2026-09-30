import { useSelector } from "react-redux";
import ManagementTable from "../../../../components/organisms/management-table";

type InitialCentroid = {
  no: number;
  c: string;
  name: string;
  x: number;
  y: number;
};
type FavoritesState = {
  data: { initial_centroids?: InitialCentroid[] } | null;
  loading: boolean;
};

const InitialCentroidsTable = () => {
  const favorites = useSelector(
    (state: { Favorites: FavoritesState }) => state.Favorites,
  );
  const rows = favorites.data?.initial_centroids;
  if (!rows) return null;

  const columns = [
    { id: "no", numeric: false, disablePadding: true, label: "No" },
    { id: "c", numeric: false, disablePadding: false, label: "C" },
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Name Menu",
    },
    { id: "x", numeric: false, disablePadding: false, label: "X" },
    { id: "y", numeric: false, disablePadding: false, label: "Y" },
  ];

  return (
    <ManagementTable
      title="C Awal"
      columns={columns}
      rows={rows}
      loading={favorites.loading}
    />
  );
};

export default InitialCentroidsTable;
