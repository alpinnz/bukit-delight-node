import ContainerBase from "../../../components/templates/kasir/container.base";
import DialogPayment from "./orders/payment-dialog";
import DialogReview from "./orders/review-dialog";
import ListOrders from "./orders/list-orders";

const KasirOrdersPage = () => (
  <ContainerBase title="Orders" tabActive={1}>
    <ListOrders />
    <DialogPayment />
    <DialogReview />
  </ContainerBase>
);

export default KasirOrdersPage;
