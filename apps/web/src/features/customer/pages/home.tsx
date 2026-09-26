import { useEffect } from "react";
import Mobile from "./home/mobile";
import { Hidden } from "@material-ui/core";
import Laptop from "./laptop.page";

const CustomerHomePage = () => {
  useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <div>
      <Hidden smUp>
        <Mobile />
      </Hidden>
      <Hidden xsDown mdUp>
        <Mobile />
      </Hidden>
      <Hidden smDown>
        <Laptop />
      </Hidden>
    </div>
  );
};

export default CustomerHomePage;
