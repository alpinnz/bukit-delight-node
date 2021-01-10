/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import TableCustom from "./../../../components/common/table.custom";
import { useDispatch, useSelector } from "react-redux";
import Form from "./form";
import Actions from "./../../../actions";

const Table = () => {
  const Tables = useSelector((state) => state.Tables);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.Tables.onLoad());
  }, []);

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
      />
      <Form />
    </div>
  );
};

export default Table;
