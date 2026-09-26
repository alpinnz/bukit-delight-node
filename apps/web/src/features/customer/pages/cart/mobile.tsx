import { useSelector } from "react-redux";
import ContainerBase from "../../../../components/common/container.customer.base";
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
  <ContainerBase navigationActive={0} title={undefined} type={undefined}>
    <div style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}>
      <Overview />
      <CartContent />
    </div>
  </ContainerBase>
);

export default CustomerCartMobilePage;
