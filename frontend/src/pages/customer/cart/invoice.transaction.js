import React from "react";
import InvoiceOverview from "./../../../components/common/invoice.overview";
import { useSelector } from "react-redux";
import AccordionListCategories from "./../../../components/common/accordion.list.categories";

const InvoiceTransaction = () => {
  const transaction = useSelector((state) => state.Cart.transaction);

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

export default InvoiceTransaction;
