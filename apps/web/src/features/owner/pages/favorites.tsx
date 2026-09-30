import OwnerTemplate from "../../../components/templates/owner/layout";
import TableCAwal from "./favorites/initial-centroids-table";
import TableCluster from "./favorites/cluster-tables";
import TableDataSet from "./favorites/dataset-table";
import TableKMeans from "./favorites/kmeans-table";
import TableResultFavorit from "./favorites/favorite-results-table";

const OwnerFavoritesPage = () => (
  <OwnerTemplate title="Favorites">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <TableDataSet />
      <TableCAwal />
    </div>
    <TableKMeans />
    <TableCluster />
    <TableResultFavorit />
  </OwnerTemplate>
);

export default OwnerFavoritesPage;
