/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import CountdownCustom from "./../../../components/common/countdown.custom";

const TableQueueView = (props) => {
  const { table, queue } = props;
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          minWidth: "6rem",
          backgroundColor: "#D95C17",
          height: 130,
          marginRight: "0.25rem",
          borderRadius: 9,
        }}
      >
        <div
          style={{
            backgroundColor: "#632F11",
            padding: "0.25rem",
            height: 28,
            borderTopLeftRadius: 9,
            borderTopRightRadius: 9,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography style={{ color: "#FFFFFF" }} align="center">
            No. Meja
          </Typography>
        </div>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            height: 4,
          }}
        />
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 88,
            display: "flex",
          }}
        >
          <Typography variant="h3" style={{ color: "#FFFFFF" }} align="center">
            {table ? table : "- -"}
          </Typography>
        </div>
      </div>
      <div
        style={{
          minWidth: "1rem",
        }}
      />
      <div
        style={{
          backgroundColor: "#FF833D",
          minWidth: "10rem",
          height: 130,
          marginLeft: "0.25rem",
          borderRadius: 9,
          position: "relative",
        }}
      >
        <div
          style={{
            backgroundColor: "#632F11",
            padding: "0.25rem",
            height: 28,
            borderTopLeftRadius: 9,
            borderTopRightRadius: 9,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography style={{ color: "#FFFFFF" }} align="center">
            No. Antrian
          </Typography>
        </div>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            height: 4,
          }}
        />
        <div
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: 88,
            display: "flex",
          }}
        >
          <Typography variant="h3" style={{ color: "#FFFFFF" }} align="center">
            {queue ? queue : "- -"}
          </Typography>
        </div>
      </div>
    </div>
  );
};

const Overview = () => {
  const Tables = useSelector((state) => state.Tables);
  const Cart = useSelector((state) => state.Cart);
  const Transactions = useSelector((state) => state.Transactions);

  if (Cart.order && Tables.table) {
    return (
      <div style={{ paddingTop: 15 }}>
        <div
          style={{
            height: "3rem",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Typography
            variant="h6"
            style={{
              color: "#288806",
            }}
            align="center"
          >
            Selesaikan pembayaran dikasir
          </Typography>
        </div>

        <CountdownCustom date={Cart.order.expires} />
        <TableQueueView table={Tables.table.name} />
      </div>
    );
  }

  if (Cart.transaction && Tables.table) {
    const data_transaction = Transactions.data.filter(
      (e) => e.status !== "done"
    );
    const data_sort = data_transaction.sort((a, b) => {
      return a["createdAt"] - b["createdAt"];
    });

    const queue_data = data_sort.findIndex(
      (e) => e._id === Cart.transaction._id
    );
    const queue = queue_data + 1;

    return (
      <div style={{ paddingTop: 15 }}>
        <div
          style={{
            height: "3rem",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Typography
            variant="h6"
            style={{
              color: "#288806",
            }}
            align="center"
          >
            {Cart.transaction.status === "pending" && "Pesanan sedang antri"}
            {Cart.transaction.status === "proses" && "Pesanan sedang dibuatkan"}
            {Cart.transaction.status === "done" && "Pesanan siap disajikan"}
          </Typography>
        </div>

        <CountdownCustom date={Cart.transaction.id_order.estimasi} />
        <TableQueueView queue={queue} table={Tables.table.name} />
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 15 }}>
      <div
        style={{
          height: "3rem",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <Typography
          variant="h6"
          style={{
            color: "#288806",
          }}
          align="center"
        >
          Bukit Delight
        </Typography>
      </div>

      <CountdownCustom />
      <TableQueueView />
    </div>
  );
};

export default Overview;
