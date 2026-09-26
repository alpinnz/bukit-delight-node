import { useEffect } from "react";
import { Hidden } from "@material-ui/core";
import CustomerBookMobilePage from "./mobile";
import CustomerLaptopPage from "../laptop.page";

const CustomerBookPage = () => {
  useEffect(() => {
    document.title = "Book";
  }, []);

  return (
    <div>
      <Hidden smUp>
        <CustomerBookMobilePage />
      </Hidden>
      <Hidden xsDown mdUp>
        <CustomerBookMobilePage />
      </Hidden>
      <Hidden smDown>
        <CustomerLaptopPage />
      </Hidden>
    </div>
  );
};

export default CustomerBookPage;
