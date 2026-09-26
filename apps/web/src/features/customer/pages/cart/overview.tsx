import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import CountdownCustom from "../../../../components/common/countdown.custom";

type Table = { name: string };
type CartOrder = { expires: string | number | Date };
type Transaction = {
  _id: string;
  status: string;
  createdAt: string | number | Date;
  id_order: { estimasi: string | number | Date };
};
type CartState = { order: CartOrder | null; transaction: Transaction | null };
type CustomerCartOverviewState = {
  Tables: { table: Table | null };
  Cart: CartState;
  Transactions: { data: Transaction[] };
};

const TableQueueView = ({
  table,
  queue,
}: {
  table?: string;
  queue?: number;
}) => (
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
      <div style={{ backgroundColor: "#FFFFFF", height: 4 }} />
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 88,
          display: "flex",
        }}
      >
        <Typography variant="h3" style={{ color: "#FFFFFF" }} align="center">
          {table || "- -"}
        </Typography>
      </div>
    </div>
    <div style={{ minWidth: "1rem" }} />
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
      <div style={{ backgroundColor: "#FFFFFF", height: 4 }} />
      <div
        style={{
          alignItems: "center",
          justifyContent: "center",
          height: 88,
          display: "flex",
        }}
      >
        <Typography variant="h3" style={{ color: "#FFFFFF" }} align="center">
          {queue || "- -"}
        </Typography>
      </div>
    </div>
  </div>
);

const CustomerCartOverview = () => {
  const { table } = useSelector(
    (state: CustomerCartOverviewState) => state.Tables,
  );
  const cart = useSelector((state: CustomerCartOverviewState) => state.Cart);
  const transactions = useSelector(
    (state: CustomerCartOverviewState) => state.Transactions.data,
  );

  if (cart.order && table) {
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
          <Typography variant="h6" style={{ color: "#288806" }} align="center">
            Selesaikan pembayaran dikasir
          </Typography>
        </div>
        <CountdownCustom date={cart.order.expires} />
        <TableQueueView table={table.name} />
      </div>
    );
  }

  if (cart.transaction && table) {
    const pendingTransactions = transactions
      .filter((transaction) => transaction.status !== "done")
      .slice()
      .sort(
        (first, second) =>
          new Date(first.createdAt).getTime() -
          new Date(second.createdAt).getTime(),
      );
    const queue =
      pendingTransactions.findIndex(
        (transaction) => transaction._id === cart.transaction?._id,
      ) + 1;
    const statusMessage = {
      pending: "Pesanan sedang antri",
      proses: "Pesanan sedang dibuatkan",
      done: "Pesanan siap disajikan",
    }[cart.transaction.status];

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
          <Typography variant="h6" style={{ color: "#288806" }} align="center">
            {statusMessage}
          </Typography>
        </div>
        <CountdownCustom date={cart.transaction.id_order.estimasi} />
        <TableQueueView queue={queue} table={table.name} />
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
        <Typography variant="h6" style={{ color: "#288806" }} align="center">
          Bukit Delight
        </Typography>
      </div>
      <CountdownCustom />
      <TableQueueView />
    </div>
  );
};

export default CustomerCartOverview;
