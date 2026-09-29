import { useEffect } from "react";
import CustomerBookMobilePage from "./mobile";
import CustomerLaptopPage from "../laptop.page";

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
        <CustomerLaptopPage />
      </div>
    </div>
  );
};

export default CustomerBookPage;
