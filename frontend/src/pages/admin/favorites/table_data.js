import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

export default function TableData(props) {
  const { data = [] } = props;
  return (
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
        {data.map((row, i) => (
          <TableRow key={i}>
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
}
