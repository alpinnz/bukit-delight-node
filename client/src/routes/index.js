import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import PrivateRoute from "./private.route";

import LandingPage from "./../pages/landing.page";
// customers page
import HomePage from "./../pages/customer/home.page";
import BookPage from "./../pages/customer/book.page";
import MenuPage from "./../pages/customer/menu.page";
import CartPage from "./../pages/customer/cart.page";
// admins page
import LoginPage from "./../pages/admin/login.page";
import DashboardPage from "./../pages/admin/dashboard.page";
import MenusPage from "./../pages/admin/menus.page";
import CategoriesPage from "./../pages/admin/categories.page";
import TablesPage from "./../pages/admin/tables.page";
import AccountsPage from "./../pages/admin/accounts.page";

const Routes = () => {
  return (
    <Router>
      <Switch>
        {/* Landding Page */}
        <Route path="/" exact component={LandingPage} />

        {/* CUSTOMER ROUTE */}
        <Route path="/customer/home" component={HomePage} />
        <Route path="/customer/book" component={BookPage} />
        <Route path="/customer/book/:_id" component={MenuPage} />
        <Route path="/customer/cart" component={CartPage} />

        {/* ADMIN ROUTE */}
        <Route path="/admin/login" component={LoginPage} />
        <PrivateRoute path="/admin/dashboard" component={DashboardPage} />
        <PrivateRoute path="/admin/menus" component={MenusPage} />
        <PrivateRoute path="/admin/categories" component={CategoriesPage} />
        <PrivateRoute path="/admin/tables" component={TablesPage} />
        <PrivateRoute path="/admin/accounts" component={AccountsPage} />
        <Redirect from="/admin*" to="/admin/dashboard" />
        <Redirect from="/customer*" to="/customer/home" />
        <Redirect from="/*" to="/" />
      </Switch>
    </Router>
  );
};

export default Routes;
