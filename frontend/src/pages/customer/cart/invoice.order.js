import React from "react";
import InvoiceOverview from "./../../../components/common/invoice.overview";
import { useSelector } from "react-redux";
import AccordionListCategories from "./../../../components/common/accordion.list.categories";

const InvoiceOerder = () => {
  const order = useSelector((state) => state.Cart.order);

  return (
    <div>
      <InvoiceOverview status={order.status} data={order} />
      <AccordionListCategories data={order.categories} />
    </div>
  );
};

export default InvoiceOerder;
