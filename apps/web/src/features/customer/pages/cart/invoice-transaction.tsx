import { useSelector } from "react-redux";
import OrderInvoiceOverview from "../../../orders/components/order-invoice-overview";
import type { InvoiceRecord } from "../../../orders/components/order-invoice-overview";
import type { OrderedCategory } from "../../../orders/components/order-category-accordion";
import OrderCategoryAccordion from "../../../orders/components/order-category-accordion";

type OrderInvoiceData = InvoiceRecord & { categories: OrderedCategory[] };
type TransactionInvoiceData = {
  id: string;
  status?: string;
  user_id?: { username?: string };
  order_id: OrderInvoiceData;
};
type CustomerTransactionInvoiceState = {
  Cart: { transaction: TransactionInvoiceData };
};

const CustomerTransactionInvoice = () => {
  const transaction = useSelector(
    (state: CustomerTransactionInvoiceState) => state.Cart.transaction,
  );

  return (
    <div>
      <OrderInvoiceOverview
        no_transaction={transaction.id}
        status={transaction.status}
        account={transaction.user_id}
        data={transaction.order_id}
      />
      <OrderCategoryAccordion data={transaction.order_id.categories} />
    </div>
  );
};

export default CustomerTransactionInvoice;
