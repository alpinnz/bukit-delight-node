import React from "react";
import { withRouter } from "react-router-dom";
import Mobile from "./mobile";
import { Hidden } from "@material-ui/core";
import Laptop from "./../laptop";

const CartPage = () => {
  document.title = "Cart";
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

export default withRouter(CartPage);
