import { useSelector } from "react-redux";
import InvoiceOverview from "../../components/invoice-overview";
import type { InvoiceRecord } from "../../components/invoice-overview";
import type { OrderedCategory } from "../../components/accordion-list-categories";
import AccordionListCategories from "../../components/accordion-list-categories";

type OrderInvoiceData = InvoiceRecord & { categories: OrderedCategory[] };
type CustomerOrderInvoiceState = { Cart: { order: OrderInvoiceData } };

const CustomerOrderInvoice = () => {
  const order = useSelector(
    (state: CustomerOrderInvoiceState) => state.Cart.order,
  );

  return (
    <div>
      <InvoiceOverview status={order.status} data={order} />
      <AccordionListCategories data={order.categories} />
    </div>
  );
};

export default CustomerOrderInvoice;
