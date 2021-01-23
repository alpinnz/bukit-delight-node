/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import TableCustom from "./../../../components/common/table.custom";
import { useSelector } from "react-redux";
import Form from "./form";
const Table = () => {
  const Tables = useSelector((state) => state.Tables);

  if (!Tables.data) {
    return <div />;
  }

  const columns = [
    {
      id: "name",
      numeric: false,
      disablePadding: false,
      label: "Name",
    },
  ];

  return (
    <div>
      <TableCustom
        title="Tables"
        columns={columns}
        rows={Tables["data"]}
        loading={Tables.loading}
        add
        update
        remove
        no
      />
      <Form />
    </div>
  );
};

export default Table;
