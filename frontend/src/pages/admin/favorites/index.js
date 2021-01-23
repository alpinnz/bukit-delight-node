import React from "react";
import { withRouter } from "react-router-dom";
import Template from "./../../../components/templates/admin";
import TableDataSet from "./table_dataset";
import TableCAwal from "./table_c_awal";
import TableKMeans from "./table_kmeans";
import TableCluster from "./table_cluster";
import TableResultFavorit from "./table_result_favorit";
import Grid from "@material-ui/core/Grid";

const FavoritesPage = () => {
  return (
    <Template title="Favorites">
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
    </Template>
  );
};

export default withRouter(FavoritesPage);
