import AdminTemplate from "../../../components/templates/admin";
import TableCAwal from "./favorites/initial-centroids-table";
import TableCluster from "./favorites/cluster-tables";
import TableDataSet from "./favorites/dataset-table";
import TableKMeans from "./favorites/kmeans-table";
import TableResultFavorit from "./favorites/favorite-results-table";

const AdminFavoritesPage = () => (
  <AdminTemplate title="Favorites">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TableDataSet />
      <TableCAwal />
    </div>
    <TableKMeans />
    <TableCluster />
    <TableResultFavorit />
  </AdminTemplate>
);

export default AdminFavoritesPage;
