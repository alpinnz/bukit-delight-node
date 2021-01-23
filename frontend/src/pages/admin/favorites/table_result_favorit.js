/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import TableCustom from "./../../../components/common/table.custom";
import { useSelector } from "react-redux";

const Table = () => {
  const Favorites = useSelector((state) => state.Favorites);

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
      id: "isAvailable",
      numeric: false,
      disablePadding: false,
      label: "Available",
      cell: (row) => (
        <div>{row.isAvailable ? "Tersedia" : "Tidak Tersedia"}</div>
      ),
    },
  ];
  if (!Favorites.data && !Favorites.data.menu_favorit) {
    return <div />;
  }

  return (
    <div>
      <TableCustom
        title="Result Menu Favorit"
        columns={columns}
        rows={Favorites["data"]["menu_favorit"]}
        loading={Favorites.loading}
        no
      />
    </div>
  );
};

export default Table;
