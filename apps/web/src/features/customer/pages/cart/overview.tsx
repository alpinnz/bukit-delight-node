import Text from "../../../../components/atoms/text";
import { useSelector } from "react-redux";
import OrderCountdown from "../../components/order-countdown";

type Table = { name: string };
type CartOrder = { expires: string | number | Date };
type Transaction = {
  id: string;
  status: string;
  created_at: string | number | Date;
  order_id: { estimated_ready_at: string | number | Date };
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
        <Text className="text-center text-white">No. Meja</Text>
      </div>
      <div className="h-1 bg-white" />
      <div className="flex h-[88px] items-center justify-center">
        <Text variant="h3" className="text-center text-white">
          {table || "- -"}
        </Text>
      </div>
    </div>
    <div className="w-4" />
    <div className="relative ml-1 h-[130px] min-w-40 rounded-[9px] bg-[#FF833D]">
      <div className="flex h-7 items-center justify-center rounded-t-[9px] bg-brand-brown p-1">
        <Text className="text-center text-white">No. Antrian</Text>
      </div>
      <div className="h-1 bg-white" />
      <div className="flex h-[88px] items-center justify-center">
        <Text variant="h3" className="text-center text-white">
          {queue || "- -"}
        </Text>
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
          <Text variant="h6" className="text-center text-brand-success">
            Selesaikan pembayaran dikasir
          </Text>
        </div>
        <OrderCountdown date={cart.order.expires} />
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
          new Date(first.created_at).getTime() -
          new Date(second.created_at).getTime(),
      );
    const queue =
      pendingTransactions.findIndex(
        (transaction) => transaction.id === cart.transaction?.id,
      ) + 1;
    const statusMessage = {
      pending: "Pesanan sedang antri",
      processing: "Pesanan sedang dibuatkan",
      done: "Pesanan siap disajikan",
    }[cart.transaction.status];

    return (
      <div className="pt-[15px]">
        <div className="flex h-12 items-center justify-center">
          <Text variant="h6" className="text-center text-brand-success">
            {statusMessage}
          </Text>
        </div>
        <OrderCountdown date={cart.transaction.order_id.estimated_ready_at} />
        <TableQueueView queue={queue} table={table.name} />
      </div>
    );
  }

  return (
    <div className="pt-[15px]">
      <div className="flex h-12 items-center justify-center">
        <Text variant="h6" className="text-center text-brand-success">
          Bukit Delight
        </Text>
      </div>
      <OrderCountdown />
      <TableQueueView />
    </div>
  );
};

export default CustomerCartOverview;
