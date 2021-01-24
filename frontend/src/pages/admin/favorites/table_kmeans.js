import { Grid, Typography, Paper } from "@material-ui/core";
import React from "react";
import TableData from "./table_data";
import TableNewData from "./table_newdata";
import { useSelector } from "react-redux";

export default function BasicTable() {
  const Favorites = useSelector((state) => state.Favorites);
  if (!Favorites.data && !Favorites.data.data_kmeans) {
    return <div />;
  }

  return (
    <div>
      <Typography align="center" variant="h5">
        {`Data K-Means`}
      </Typography>
      {Favorites.data.data_kmeans.map((e, i) => {
        const data = e.data;

        const detail = e.new_data.detail;

        const sum = {
          no: "sum",
          c1: detail.sum.c1,
          c2: detail.sum.c2,
          c3: detail.sum.c3,
        };

        const count = {
          no: "count",
          c1: detail.count.c1,
          c2: detail.count.c2,
          c3: detail.count.c3,
        };

        const avg = {
          no: "avg",
          c1: { x: detail.avg.c1.x.toFixed(3), y: detail.avg.c1.y.toFixed(3) },
          c2: { x: detail.avg.c2.x.toFixed(3), y: detail.avg.c2.y.toFixed(3) },
          c3: { x: detail.avg.c3.x.toFixed(3), y: detail.avg.c3.y.toFixed(3) },
        };
        let newData = e.new_data.data.concat(sum, count, avg);
        // const sum_check = newData.find((e) => e.no === "sum");
        // if (!sum_check) {
        //   newData.push(sum);
        // }
        // const count_check = newData.find((e) => e.no === "count");
        // if (!count_check) {
        //   newData.push(count);
        // }
        // const avg_check = newData.find((e) => e.no === "avg");
        // if (!avg_check) {
        //   newData.push(avg);
        // }

        return (
          <div key={i} style={{ marginTop: "1rem" }}>
            <Typography variant="h5">{`Iterasi ${e.iterasi}`}</Typography>
            <Grid container spacing={2}>
              <Grid item sm={12} md={5}>
                <Typography align="center" variant="h6">
                  {`Data`}
                </Typography>
                <Paper>
                  <TableData data={data} />
                </Paper>
              </Grid>
              {/* <Grid item sm={12} md={1}></Grid> */}
              <Grid item sm={12} md={7}>
                <Typography align="center" variant="h6">
                  {`New Data`}
                </Typography>
                <Paper>
                  <TableNewData data={newData} />
                </Paper>
              </Grid>
            </Grid>
          </div>
        );
      })}
    </div>
  );
}
