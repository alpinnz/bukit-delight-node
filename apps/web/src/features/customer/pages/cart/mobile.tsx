import { useSelector } from "react-redux";
import CustomerLayout from "../../../../components/templates/customer/layout";
import Overview from "./overview";
import CartOrders from "./cart-orders";
import InvoiceOrder from "./invoice-order";
import InvoiceTransaction from "./invoice-transaction";

type CartState = {
  order?: unknown;
  transaction?: unknown;
  data: unknown[];
};

type CustomerCartState = { Cart: CartState };

const CartContent = () => {
  const cart = useSelector((state: CustomerCartState) => state.Cart);

  if (cart.order) return <InvoiceOrder />;
  if (cart.transaction) return <InvoiceTransaction />;
  if (cart.data.length > 0) return <CartOrders />;
  return null;
};

const CustomerCartMobilePage = () => (
  <CustomerLayout title={undefined} type={undefined}>
    <div className="px-2">
      <Overview />
      <CartContent />
    </div>
  </CustomerLayout>
);

export default CustomerCartMobilePage;
