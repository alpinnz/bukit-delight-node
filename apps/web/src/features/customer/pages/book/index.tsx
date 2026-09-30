import { useEffect } from "react";
import CustomerBookMobilePage from "./mobile";
import CustomerDesktopOrderingPage from "../desktop-ordering-page";

const CustomerBookPage = () => {
  useEffect(() => {
    document.title = "Book";
  }, []);

  return (
    <div>
      <div className="md:hidden">
        <CustomerBookMobilePage />
      </div>
      <div className="hidden md:block">
        <CustomerDesktopOrderingPage />
      </div>
    </div>
  );
};

export default CustomerBookPage;
