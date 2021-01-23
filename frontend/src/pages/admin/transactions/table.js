/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import TableCustom from "./../../../components/common/table.custom";
import { useSelector } from "react-redux";
import convert from "./../../../helpers/convert";

const Table = () => {
  const Transactions = useSelector((state) => state.Transactions);

  if (!Transactions.data) {
    return <div />;
  }

  const columns = [
    {
      id: "account_username",
      numeric: false,
      disablePadding: true,
      label: "Account",
    },
    {
      id: "order_customer_username",
      numeric: false,
      disablePadding: false,
      label: "Customer",
    },
    {
      id: "order_table_name",
      numeric: false,
      disablePadding: false,
      label: "Table",
    },
    {
      id: "order_table_name",
      numeric: false,
      disablePadding: false,
      label: "Table",
    },
    {
      id: "order_quality",
      numeric: false,
      disablePadding: false,
      label: "Quality",
    },
    {
      id: "order_promo",
      numeric: false,
      disablePadding: false,
      label: "Promo",
    },
    {
      id: "order_price",
      numeric: false,
      disablePadding: false,
      label: "Price",
    },
    {
      id: "order_total_price",
      numeric: false,
      disablePadding: false,
      label: "Total Price",
    },
    {
      id: "order_status",
      numeric: false,
      disablePadding: false,
      label: "Pay",
    },
    {
      id: "status",
      numeric: false,
      disablePadding: false,
      label: "Status",
    },

    {
      id: "createdAt",
      numeric: false,
      disablePadding: false,
      label: "Date",
      cell: (row) => <div>{convert.DateToTanggal(row.createdAt)}</div>,
    },
  ];

  return (
    <div>
      <TableCustom
        title="Transactions"
        columns={columns}
        rows={Transactions["data"]}
        loading={Transactions.loading}
        no
      />
    </div>
  );
};

export default Table;
