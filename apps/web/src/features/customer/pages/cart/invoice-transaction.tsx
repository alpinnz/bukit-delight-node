import { useSelector } from "react-redux";
import InvoiceOverview from "../../components/invoice-overview";
import type { InvoiceRecord } from "../../components/invoice-overview";
import type { OrderedCategory } from "../../components/accordion-list-categories";
import AccordionListCategories from "../../components/accordion-list-categories";

type OrderInvoiceData = InvoiceRecord & { categories: OrderedCategory[] };
type TransactionInvoiceData = {
  _id: string;
  status?: string;
  id_account?: { username?: string };
  id_order: OrderInvoiceData;
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
      <InvoiceOverview
        no_transaction={transaction._id}
        status={transaction.status}
        account={transaction.id_account}
        data={transaction.id_order}
      />
      <AccordionListCategories data={transaction.id_order.categories} />
    </div>
  );
};

export default CustomerTransactionInvoice;
