import { useState } from "react";
import {
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../../actions";

type CashierTransaction = {
  _id: string;
  status: string;
  createdAt?: string | number | Date;
  id_account?: { username?: string };
  id_order?: {
    id_table?: { name?: string };
    id_customer?: { username?: string };
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
  <div style={{ display: "flex" }}>
    <div style={{ width: "6rem" }}>
      <Typography align="left" color="textSecondary">
        {title}
      </Typography>
    </div>
    <div style={{ marginRight: "1rem" }}>
      <Typography align="left" color="textSecondary">
        :
      </Typography>
    </div>
    <Typography align="left" color="textSecondary">
      {value ?? "—"}
    </Typography>
  </div>
);

const CashierTransactionList = () => {
  const transactions = useSelector(
    (state: TransactionsState) => state.Transactions.data,
  );
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("no");

  const activeTransactions: NumberedTransaction[] = transactions
    .filter((transaction) => transaction.status !== "done")
    .slice()
    .sort(
      (left, right) =>
        new Date(left.createdAt ?? 0).getTime() -
        new Date(right.createdAt ?? 0).getTime(),
    )
    .map((transaction, index) => ({
      ...transaction,
      queueNumber: index + 1,
    }));

  const sortedTransactions = activeTransactions.slice().sort((left, right) => {
    if (sortKey === "status") return left.status.localeCompare(right.status);
    if (sortKey === "table") {
      return (left.id_order?.id_table?.name ?? "").localeCompare(
        right.id_order?.id_table?.name ?? "",
        undefined,
        { numeric: true, sensitivity: "base" },
      );
    }
    return left.queueNumber - right.queueNumber;
  });

  const selectSort = (key: SortKey) => {
    setSortKey(key);
    setAnchorEl(null);
  };

  const openReview = (transaction: CashierTransaction) => {
    dispatch(Actions.Transactions.setTransaction(transaction));
    dispatch(Actions.Transactions.openDialogReview());
  };

  return (
    <div style={{ padding: "0.5rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          aria-label="Filter transactions"
          aria-controls="cashier-transaction-sort-menu"
          aria-haspopup="true"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <FilterListIcon />
        </IconButton>
        <Menu
          id="cashier-transaction-sort-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => selectSort("no")}>No Antrian</MenuItem>
          <MenuItem onClick={() => selectSort("table")}>No Meja</MenuItem>
          <MenuItem onClick={() => selectSort("status")}>Status</MenuItem>
        </Menu>
      </div>
      {sortedTransactions.length === 0 ? (
        <Typography color="textSecondary" align="center">
          Tidak ada transaksi aktif.
        </Typography>
      ) : (
        sortedTransactions.map((transaction) => (
          <div key={transaction._id} style={{ paddingTop: "0.5rem" }}>
            <Button
              fullWidth
              aria-label={`Transaksi antrian ${transaction.queueNumber}`}
              style={{
                padding: "1rem",
                boxShadow: "1px 0.5px 2.5px 0.5px #9E9E9E",
                borderRadius: 20,
                display: "block",
                textTransform: "none",
              }}
              onClick={() => openReview(transaction)}
            >
              <div style={{ width: "100%" }}>
                <TextTitleValue
                  title="No Antrian"
                  value={transaction.queueNumber}
                />
                <TextTitleValue
                  title="No Meja"
                  value={transaction.id_order?.id_table?.name}
                />
                <TextTitleValue
                  title="Account"
                  value={transaction.id_account?.username}
                />
                <TextTitleValue
                  title="Customer"
                  value={transaction.id_order?.id_customer?.username}
                />
                <TextTitleValue title="Status" value={transaction.status} />
              </div>
            </Button>
          </div>
        ))
      )}
    </div>
  );
};

export default CashierTransactionList;
