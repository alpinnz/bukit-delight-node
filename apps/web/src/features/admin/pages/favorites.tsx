import Grid from "@material-ui/core/Grid";
import AdminTemplate from "../../../components/templates/admin";
import TableCAwal from "./favorites/initial-centroids-table";
import TableCluster from "./favorites/cluster-tables";
import TableDataSet from "./favorites/dataset-table";
import TableKMeans from "./favorites/kmeans-table";
import TableResultFavorit from "./favorites/favorite-results-table";

const AdminFavoritesPage = () => (
  <AdminTemplate title="Pemesanan">
    <Grid container spacing={2}>
      <Grid item md={6} sm={12}>
        <TableDataSet />
      </Grid>
      <Grid item md={6} sm={12}>
        <TableCAwal />
      </Grid>
    </Grid>
    <Grid container spacing={0}>
      <Grid item md={12} sm={12}>
        <TableKMeans />
      </Grid>
    </Grid>
    <Grid container spacing={0}>
      <Grid item md={12} sm={12}>
        <TableCluster />
      </Grid>
    </Grid>
    <Grid container spacing={0}>
      <Grid item md={12} sm={12}>
        <TableResultFavorit />
      </Grid>
    </Grid>
  </AdminTemplate>
);

export default AdminFavoritesPage;
