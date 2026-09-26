import { useEffect } from "react";
import { Hidden } from "@material-ui/core";
import Mobile from "./mobile";
import Desktop from "../laptop.page";

const CustomerCartPage = () => {
  useEffect(() => {
    document.title = "Cart";
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
        <Desktop />
      </Hidden>
    </div>
  );
};

export default CustomerCartPage;
