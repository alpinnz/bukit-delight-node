/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import TableCustom from "./../../../components/common/table.custom";
import { useDispatch, useSelector } from "react-redux";
import Form from "./form";
import Actions from "./../../../actions";

const Table = () => {
  const Categories = useSelector((state) => state.Categories);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.Categories.onLoad());
  }, []);

  const columns = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    {
      id: "desc",
      numeric: false,
      disablePadding: false,
      label: "Description",
    },
    {
      id: "image",
      numeric: false,
      disablePadding: false,
      label: "Image",
      cell: (row) => (
        <img height="56px" width="76px" alt={row.name} src={row.image} />
      ),
    },
  ];

  return (
    <div>
      <TableCustom
        title="Categories"
        columns={columns}
        rows={Categories["data"]}
        loading={Categories.loading}
      />
      <Form />
    </div>
  );
};

export default Table;
