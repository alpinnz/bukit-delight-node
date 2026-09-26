import Grid from "@material-ui/core/Grid";
import { useSelector } from "react-redux";
import TableCustom from "../../../../components/common/table.custom";

type ClusterMenu = {
  no: number;
  name: string;
  total_transactions: number;
  price: number;
};
type ClusterResults = Record<"c1" | "c2" | "c3", ClusterMenu[]>;
type FavoritesState = {
  data: { menu_cluster_akhir?: ClusterResults } | null;
  loading: boolean;
};

const columns = [
  { id: "name", numeric: false, disablePadding: false, label: "Name Menu" },
  {
    id: "total_transactions",
    numeric: false,
    disablePadding: false,
    label: "Transactions",
  },
  { id: "price", numeric: false, disablePadding: false, label: "Price" },
];

const ClusterTables = () => {
  const favorites = useSelector(
    (state: { Favorites: FavoritesState }) => state.Favorites,
  );
  const clusters = favorites.data?.menu_cluster_akhir;
  if (!clusters) return null;

  return (
    <Grid container spacing={2}>
      {(["c1", "c2", "c3"] as const).map((clusterId, index) => (
        <Grid key={clusterId} item sm={12} md={4}>
          <TableCustom
            title={`Cluster ${index + 1}`}
            columns={columns}
            rows={clusters[clusterId]}
            loading={favorites.loading}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default ClusterTables;
