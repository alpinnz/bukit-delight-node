/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import TableCustom from "./../../../components/common/table.custom";
import { useSelector } from "react-redux";
import Form from "./form";
const Table = () => {
  const Menus = useSelector((state) => state.Menus);

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
      id: "duration",
      numeric: false,
      disablePadding: false,
      label: "Duration",
      cell: (row) => (
        <div>{row.duration ? `${row.duration} Minute` : `0 Minute`}</div>
      ),
    },
    {
      id: "category_name",
      numeric: false,
      disablePadding: false,
      label: "Categories",
    },
    {
      id: "isAvailable",
      numeric: false,
      disablePadding: false,
      label: "Available",
      cell: (row) => (
        <div>{row.isAvailable ? "Tersedia" : "Tidak Tersedia"}</div>
      ),
    },
  ];

  return (
    <div>
      <TableCustom
        title="Menus"
        columns={columns}
        rows={Menus["data"]}
        loading={Menus.loading}
        add
        update
        remove
      />
      <Form />
    </div>
  );
};

export default Table;
