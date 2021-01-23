/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import TableCustom from "./../../../components/common/table.custom";
import { useSelector } from "react-redux";

const Table = () => {
  const Favorites = useSelector((state) => state.Favorites);

  const columns = [
    {
      id: "no",
      numeric: false,
      disablePadding: true,
      label: "No",
    },
    {
      id: "c",
      numeric: false,
      disablePadding: false,
      label: "C",
    },
    {
      id: "name_menu",
      numeric: false,
      disablePadding: false,
      label: "Name Menu",
    },
    {
      id: "x",
      numeric: false,
      disablePadding: false,
      label: "X",
    },
    {
      id: "y",
      numeric: false,
      disablePadding: false,
      label: "Y",
    },
  ];
  if (!Favorites.data && !Favorites.data.c_awal) {
    return <div />;
  }

  return (
    <div>
      <TableCustom
        title="C Awal"
        columns={columns}
        rows={Favorites["data"]["c_awal"]}
        loading={Favorites.loading}
      />
    </div>
  );
};

export default Table;
