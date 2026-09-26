import ContainerBase from "../../../components/templates/kasir/container.base";
import DialogReview from "./transactions/review-dialog";
import DialogStatus from "./transactions/status-dialog";
import ListTransactions from "./transactions/list-transactions";

const KasirTransactionsPage = () => (
  <ContainerBase title="Transactions" tabActive={2}>
    <ListTransactions />
    <DialogReview />
    <DialogStatus />
  </ContainerBase>
);

export default KasirTransactionsPage;
