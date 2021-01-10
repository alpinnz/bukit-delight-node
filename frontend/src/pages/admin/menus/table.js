/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import TableCustom from "./../../../components/common/table.custom";
import { useDispatch, useSelector } from "react-redux";
import Form from "./form";
import Actions from "./../../../actions";

const Table = () => {
  const Menus = useSelector((state) => state.Menus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.Menus.onLoad());
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
    {
      id: "price",
      numeric: false,
      disablePadding: true,
      label: "Price",
    },
    {
      id: "promo",
      numeric: false,
      disablePadding: false,
      label: "Promo",
    },
    {
      id: "category_name",
      numeric: false,
      disablePadding: false,
      label: "Categories",
    },
  ];

  return (
    <div>
      <TableCustom
        title="Menus"
        columns={columns}
        rows={Menus["data"]}
        loading={Menus.loading}
      />
      <Form />
    </div>
  );
};

export default Table;
