import React from "react";
import { withRouter } from "react-router-dom";
import Template from "./../../components/templates/admin";

const DashboardPage = () => {
  return <Template title="Dashboard">DashboardPage</Template>;
};

export default withRouter(DashboardPage);
