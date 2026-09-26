import { Grid, Paper, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

type DistanceRow = {
  no: number;
  c1: number;
  c2: number;
  c3: number;
  cluster: number;
};
type Coordinates = { x: number | string; y: number | string };
type NewDataRow = {
  no: number | string;
  c1: Coordinates;
  c2: Coordinates;
  c3: Coordinates;
};
type Aggregate = { x: number; y: number };
type Detail = {
  sum: Record<"c1" | "c2" | "c3", Aggregate>;
  count: Record<"c1" | "c2" | "c3", Aggregate>;
  avg: Record<"c1" | "c2" | "c3", Aggregate>;
};
type Iteration = {
  iterasi: number;
  data: DistanceRow[];
  new_data: { data: NewDataRow[]; detail: Detail };
};
type FavoritesState = {
  data: { data_kmeans?: Iteration[] } | null;
  loading: boolean;
};

const DataTable = ({ rows }: { rows: DistanceRow[] }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell align="center">No</TableCell>
        <TableCell align="center">C1</TableCell>
        <TableCell align="center">C2</TableCell>
        <TableCell align="center">C3</TableCell>
        <TableCell align="center">Cluster</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.no}>
          <TableCell align="center">{row.no}</TableCell>
          <TableCell align="right">{row.c1.toFixed(3)}</TableCell>
          <TableCell align="right">{row.c2.toFixed(3)}</TableCell>
          <TableCell align="right">{row.c3.toFixed(3)}</TableCell>
          <TableCell align="center">{row.cluster}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const NewDataTable = ({ rows }: { rows: NewDataRow[] }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell align="center">No</TableCell>
        <TableCell align="center">C1 X</TableCell>
        <TableCell align="center">C1 Y</TableCell>
        <TableCell align="center">C2 X</TableCell>
        <TableCell align="center">C2 Y</TableCell>
        <TableCell align="center">C3 X</TableCell>
        <TableCell align="center">C3 Y</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row, index) => (
        <TableRow key={`${row.no}-${index}`}>
          <TableCell scope="row" align="center">
            {row.no}
          </TableCell>
          <TableCell align="center">{row.c1.x}</TableCell>
          <TableCell align="center">{row.c1.y}</TableCell>
          <TableCell align="center">{row.c2.x}</TableCell>
          <TableCell align="center">{row.c2.y}</TableCell>
          <TableCell align="center">{row.c3.x}</TableCell>
          <TableCell align="center">{row.c3.y}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

const appendSummaryRows = (iteration: Iteration): NewDataRow[] => {
  const { detail } = iteration.new_data;
  const sum: NewDataRow = { no: "sum", ...detail.sum };
  const count: NewDataRow = { no: "count", ...detail.count };
  const avg: NewDataRow = {
    no: "avg",
    c1: { x: detail.avg.c1.x.toFixed(3), y: detail.avg.c1.y.toFixed(3) },
    c2: { x: detail.avg.c2.x.toFixed(3), y: detail.avg.c2.y.toFixed(3) },
    c3: { x: detail.avg.c3.x.toFixed(3), y: detail.avg.c3.y.toFixed(3) },
  };
  return [...iteration.new_data.data, sum, count, avg];
};

const KMeansTable = () => {
  const favorites = useSelector(
    (state: { Favorites: FavoritesState }) => state.Favorites,
  );
  const iterations = favorites.data?.data_kmeans;
  if (!iterations) return null;

  return (
    <div>
      <Typography align="center" variant="h5">
        Data K-Means
      </Typography>
      {iterations.map((iteration) => (
        <div key={iteration.iterasi} style={{ marginTop: "1rem" }}>
          <Typography variant="h5">{`Iterasi ${iteration.iterasi}`}</Typography>
          <Grid container spacing={2}>
            <Grid item sm={12} md={5}>
              <Typography align="center" variant="h6">
                Data
              </Typography>
              <Paper>
                <DataTable rows={iteration.data} />
              </Paper>
            </Grid>
            <Grid item sm={12} md={7}>
              <Typography align="center" variant="h6">
                New Data
              </Typography>
              <Paper>
                <NewDataTable rows={appendSummaryRows(iteration)} />
              </Paper>
            </Grid>
          </Grid>
        </div>
      ))}
    </div>
  );
};

export default KMeansTable;
