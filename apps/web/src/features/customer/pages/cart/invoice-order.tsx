import { useSelector } from "react-redux";
import OrderInvoiceOverview from "../../../orders/components/order-invoice-overview";
import type { InvoiceRecord } from "../../../orders/components/order-invoice-overview";
import type { OrderedCategory } from "../../../orders/components/order-category-accordion";
import OrderCategoryAccordion from "../../../orders/components/order-category-accordion";

type OrderInvoiceData = InvoiceRecord & { categories: OrderedCategory[] };
type CustomerOrderInvoiceState = { Cart: { order: OrderInvoiceData } };

const CustomerOrderInvoice = () => {
  const order = useSelector(
    (state: CustomerOrderInvoiceState) => state.Cart.order,
  );

  return (
    <div>
      <OrderInvoiceOverview status={order.status} data={order} />
      <OrderCategoryAccordion data={order.categories} />
    </div>
  );
};

export default CustomerOrderInvoice;
