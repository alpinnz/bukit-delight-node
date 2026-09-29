import ContainerBase from "../../../components/templates/cashier/container.base";
import DialogPayment from "./orders/payment-dialog";
import DialogReview from "./orders/review-dialog";
import ListOrders from "./orders/list-orders";

const CashierOrdersPage = () => (
  <ContainerBase title="Orders">
    <ListOrders />
    <DialogPayment />
    <DialogReview />
  </ContainerBase>
);

export default CashierOrdersPage;
