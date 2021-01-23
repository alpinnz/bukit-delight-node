/* eslint-disable react-hooks/exhaustive-deps */
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
          <TableCell align="center">C1 X</TableCell>
          <TableCell align="center">C1 Y</TableCell>
          <TableCell align="center">C2 X</TableCell>
          <TableCell align="center">C2 Y</TableCell>{" "}
          <TableCell align="center">C3 X</TableCell>
          <TableCell align="center">C3 Y</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map((row, i) => (
          <TableRow key={i}>
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
}
