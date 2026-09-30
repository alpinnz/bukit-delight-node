import CashierLayout from "../../../components/templates/cashier/layout";
import DialogReview from "./transactions/review-dialog";
import DialogStatus from "./transactions/status-dialog";
import ListTransactions from "./transactions/list-transactions";

const CashierTransactionsPage = () => (
  <CashierLayout title="Transactions">
    <ListTransactions />
    <DialogReview />
    <DialogStatus />
  </CashierLayout>
);

export default CashierTransactionsPage;
