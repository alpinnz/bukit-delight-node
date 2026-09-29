import { useEffect } from "react";
import Mobile from "./mobile";
import Desktop from "../laptop.page";
import PaymentDialog from "./payment-dialog";

const CustomerCartPage = () => {
  useEffect(() => {
    document.title = "Cart";
  }, []);

  return (
    <div>
      <div className="md:hidden">
        <Mobile />
      </div>
      <div className="hidden md:block">
        <Desktop />
      </div>
      <PaymentDialog />
    </div>
  );
};

export default CustomerCartPage;
