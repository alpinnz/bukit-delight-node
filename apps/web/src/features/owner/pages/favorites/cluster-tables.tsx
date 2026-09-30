import { useSelector } from "react-redux";
import ManagementTable from "../../../../components/organisms/management-table";

type ClusterMenu = {
  no: number;
  name: string;
  total_transactions: number;
  price: number;
};
type ClusterResults = Record<"c1" | "c2" | "c3", ClusterMenu[]>;
type FavoritesState = {
  data: { final_menu_clusters?: ClusterResults } | null;
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
  const clusters = favorites.data?.final_menu_clusters;
  if (!clusters) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {(["c1", "c2", "c3"] as const).map((clusterId, index) => (
        <div key={clusterId}>
          <ManagementTable
            title={`Cluster ${index + 1}`}
            columns={columns}
            rows={clusters[clusterId]}
            loading={favorites.loading}
          />
        </div>
      ))}
    </div>
  );
};

export default ClusterTables;
