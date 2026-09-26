import AdminTemplate from "../../../components/templates/admin";
import TransactionTable from "./transactions/table";

const AdminTransactionsPage = () => (
  <AdminTemplate title="Transactions">
    <TransactionTable />
  </AdminTemplate>
);

export default AdminTransactionsPage;
