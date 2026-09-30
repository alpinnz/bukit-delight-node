import OwnerTemplate from "../../../components/templates/owner/layout";
import TransactionTable from "./transactions/table";

const OwnerTransactionsPage = () => (
  <OwnerTemplate title="Transactions">
    <TransactionTable />
  </OwnerTemplate>
);

export default OwnerTransactionsPage;
