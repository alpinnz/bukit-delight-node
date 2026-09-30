import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";
import Text from "../../../../components/atoms/text";
import type { AppDispatch } from "../../../../store";

type CashierTransaction = {
  id: string;
  status: string;
  created_at?: string | number | Date;
  user_id?: { username?: string };
  order_id?: {
    table_id?: { name?: string };
    customer_id?: { username?: string };
  };
};
type TransactionsState = { Transactions: { data: CashierTransaction[] } };
type SortKey = "no" | "status" | "table";
type NumberedTransaction = CashierTransaction & { queueNumber: number };

const TextTitleValue = ({
  title,
  value,
}: {
  title: string;
  value?: string | number;
}) => (
  <div className="flex">
    <div className="w-24">
      <Text align="left" color="textSecondary">
        {title}
      </Text>
    </div>
    <div className="mr-4">
      <Text align="left" color="textSecondary">
        :
      </Text>
    </div>
    <Text align="left" color="textSecondary">
      {value ?? "—"}
    </Text>
  </div>
);

const CashierTransactionList = () => {
  const transactions = useSelector(
    (state: TransactionsState) => state.Transactions.data,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [sortKey, setSortKey] = useState<SortKey>("no");

  const activeTransactions: NumberedTransaction[] = transactions
    .filter((transaction) => transaction.status !== "done")
    .slice()
    .sort(
      (left, right) =>
        new Date(left.created_at ?? 0).getTime() -
        new Date(right.created_at ?? 0).getTime(),
    )
    .map((transaction, index) => ({
      ...transaction,
      queueNumber: index + 1,
    }));

  const sortedTransactions = activeTransactions.slice().sort((left, right) => {
    if (sortKey === "status") return left.status.localeCompare(right.status);
    if (sortKey === "table") {
      return (left.order_id?.table_id?.name ?? "").localeCompare(
        right.order_id?.table_id?.name ?? "",
        undefined,
        { numeric: true, sensitivity: "base" },
      );
    }
    return left.queueNumber - right.queueNumber;
  });

  const selectSort = (key: SortKey) => {
    setSortKey(key);
  };

  const openReview = (transaction: CashierTransaction) => {
    dispatch(Actions.Transactions.setTransaction(transaction));
    dispatch(Actions.Transactions.openDialogReview());
  };

  return (
    <div className="p-2">
      <div className="flex items-center justify-end">
        <div className="relative">
          <Menu>
            <MenuButton
              aria-label="Filter transactions"
              className="rounded-md p-2 text-slate-700 hover:bg-slate-100"
            >
              <FunnelIcon aria-hidden="true" className="size-5" />
            </MenuButton>
            <MenuItems className="absolute right-0 z-20 mt-1 w-44 rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none">
              <MenuItem>
                <button
                  type="button"
                  onClick={() => selectSort("no")}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 data-focus:bg-slate-100"
                >
                  No Antrian
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  onClick={() => selectSort("table")}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 data-focus:bg-slate-100"
                >
                  No Meja
                </button>
              </MenuItem>
              <MenuItem>
                <button
                  type="button"
                  onClick={() => selectSort("status")}
                  className="w-full px-3 py-2 text-left text-sm text-slate-700 data-focus:bg-slate-100"
                >
                  Status
                </button>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
      {sortedTransactions.length === 0 ? (
        <Text color="textSecondary" align="center">
          Tidak ada transaksi aktif.
        </Text>
      ) : (
        sortedTransactions.map((transaction) => (
          <div key={transaction.id} className="pt-2">
            <button
              type="button"
              aria-label={`Transaksi antrian ${transaction.queueNumber}`}
              className="block w-full rounded-2xl p-4 text-left shadow-[1px_0.5px_2.5px_0.5px_#9E9E9E] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-indigo-600"
              onClick={() => openReview(transaction)}
            >
              <div className="w-full">
                <TextTitleValue
                  title="No Antrian"
                  value={transaction.queueNumber}
                />
                <TextTitleValue
                  title="No Meja"
                  value={transaction.order_id?.table_id?.name}
                />
                <TextTitleValue
                  title="Account"
                  value={transaction.user_id?.username}
                />
                <TextTitleValue
                  title="Customer"
                  value={transaction.order_id?.customer_id?.username}
                />
                <TextTitleValue title="Status" value={transaction.status} />
              </div>
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default CashierTransactionList;
