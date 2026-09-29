import ContainerBase from "../../../components/templates/cashier/container.base";
import DialogReview from "./transactions/review-dialog";
import DialogStatus from "./transactions/status-dialog";
import ListTransactions from "./transactions/list-transactions";

const CashierTransactionsPage = () => (
  <ContainerBase title="Transactions">
    <ListTransactions />
    <DialogReview />
    <DialogStatus />
  </ContainerBase>
);

export default CashierTransactionsPage;
