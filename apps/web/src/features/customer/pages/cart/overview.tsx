import TextCustom from "../../../../components/common/text.custom";
import { useSelector } from "react-redux";
import CountdownCustom from "../../../../components/common/countdown.custom";

type Table = { name: string };
type CartOrder = { expires: string | number | Date };
type Transaction = {
  _id: string;
  status: string;
  createdAt: string | number | Date;
  id_order: { estimatedReadyAt: string | number | Date };
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
  <div className="flex w-full items-center justify-center">
    <div className="mr-1 h-[130px] min-w-24 rounded-[9px] bg-brand-rust">
      <div className="flex h-7 items-center justify-center rounded-t-[9px] bg-brand-brown p-1">
        <TextCustom className="text-center text-white">No. Meja</TextCustom>
      </div>
      <div className="h-1 bg-white" />
      <div className="flex h-[88px] items-center justify-center">
        <TextCustom variant="h3" className="text-center text-white">
          {table || "- -"}
        </TextCustom>
      </div>
    </div>
    <div className="w-4" />
    <div className="relative ml-1 h-[130px] min-w-40 rounded-[9px] bg-[#FF833D]">
      <div className="flex h-7 items-center justify-center rounded-t-[9px] bg-brand-brown p-1">
        <TextCustom className="text-center text-white">No. Antrian</TextCustom>
      </div>
      <div className="h-1 bg-white" />
      <div className="flex h-[88px] items-center justify-center">
        <TextCustom variant="h3" className="text-center text-white">
          {queue || "- -"}
        </TextCustom>
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
      <div className="pt-[15px]">
        <div className="flex h-12 items-center justify-center">
          <TextCustom variant="h6" className="text-center text-brand-success">
            Selesaikan pembayaran dikasir
          </TextCustom>
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
      processing: "Pesanan sedang dibuatkan",
      done: "Pesanan siap disajikan",
    }[cart.transaction.status];

    return (
      <div className="pt-[15px]">
        <div className="flex h-12 items-center justify-center">
          <TextCustom variant="h6" className="text-center text-brand-success">
            {statusMessage}
          </TextCustom>
        </div>
        <CountdownCustom date={cart.transaction.id_order.estimatedReadyAt} />
        <TableQueueView queue={queue} table={table.name} />
      </div>
    );
  }

  return (
    <div className="pt-[15px]">
      <div className="flex h-12 items-center justify-center">
        <TextCustom variant="h6" className="text-center text-brand-success">
          Bukit Delight
        </TextCustom>
      </div>
      <CountdownCustom />
      <TableQueueView />
    </div>
  );
};

export default CustomerCartOverview;
