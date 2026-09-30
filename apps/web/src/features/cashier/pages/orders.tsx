import CashierLayout from "../../../components/templates/cashier/layout";
import DialogPayment from "./orders/payment-dialog";
import DialogReview from "./orders/review-dialog";
import ListOrders from "./orders/list-orders";

const CashierOrdersPage = () => (
  <CashierLayout title="Orders">
    <ListOrders />
    <DialogPayment />
    <DialogReview />
  </CashierLayout>
);

export default CashierOrdersPage;
