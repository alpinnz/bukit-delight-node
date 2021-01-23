import { Grid } from "@material-ui/core";
import React from "react";
import TableResultC1 from "./table_result_c1";
import TableResultC2 from "./table_result_c2";
import TableResultC3 from "./table_result_c3";

export default function BasicTable() {
  return (
    <Grid container spacing={2}>
      <Grid item sm={12} md={4}>
        <TableResultC1 />
      </Grid>
      <Grid item sm={12} md={4}>
        <TableResultC2 />
      </Grid>
      <Grid item sm={12} md={4}>
        <TableResultC3 />
      </Grid>
    </Grid>
  );
}
