import { useSelector } from "react-redux";
import ManagementTable from "../../../../components/organisms/management-table";
import formatters from "../../../../helpers/formatters";

type OwnerTransaction = {
  id: string;
  user_username: string;
  order_customer_username: string;
  order_table_name: string;
  order_quality: number;
  order_promo: number;
  order_price: number;
  order_total_price: number;
  order_status: string;
  status: string;
  created_at: string;
};
type TransactionsState = { data?: OwnerTransaction[]; loading: boolean };

const TransactionTable = () => {
  const transactions = useSelector(
    (state: { Transactions: TransactionsState }) => state.Transactions,
  );
  if (!transactions.data) return null;

  const columns = [
    {
      id: "user_username",
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
    { id: "order_status", numeric: false, disablePadding: false, label: "Pay" },
    { id: "status", numeric: false, disablePadding: false, label: "Status" },
    {
      id: "created_at",
      numeric: false,
      disablePadding: false,
      label: "Date",
      cell: (transaction: OwnerTransaction) => (
        <div>{formatters.formatIndonesianDateTime(transaction.created_at)}</div>
      ),
    },
  ];

  return (
    <ManagementTable
      title="Transactions"
      columns={columns}
      rows={transactions.data}
      loading={transactions.loading}
      no
    />
  );
};

export default TransactionTable;
