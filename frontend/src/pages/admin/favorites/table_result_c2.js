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
     disablePadding: false,
     label: "Name Menu",
   },
   {
     id: "total_transactions",
     numeric: false,
     disablePadding: false,
     label: "Transactions",
   },
   {
     id: "price",
     numeric: false,
     disablePadding: false,
     label: "Price",
   },
 ];
  if (!Favorites.data && !Favorites.data.menu_cluster_akhir) {
    return <div />;
  }

  return (
    <div>
      <TableCustom
        title="Cluster 2"
        columns={columns}
        rows={Favorites["data"]["menu_cluster_akhir"]["c2"]}
        loading={Favorites.loading}
      />
    </div>
  );
};

export default Table;
