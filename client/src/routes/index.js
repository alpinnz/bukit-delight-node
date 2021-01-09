import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import PrivateRoute from "./private.route";

import LandingPage from "./../pages/landing.page";
// customers page
import HomePage from "./../pages/customer/home";
import BookPage from "./../pages/customer/book";
import MenuPage from "./../pages/customer/menu";
import CartPage from "./../pages/customer/cart";
// admins page
import LoginPage from "./../pages/login.page";
import DashboardPage from "./../pages/admin/dashboard.page";
import MenusPage from "./../pages/admin/menus";
import CategoriesPage from "./../pages/admin/categories";
import TablesPage from "./../pages/admin/tables";
import AccountsPage from "./../pages/admin/accounts";
import TransactionsPage from "./../pages/admin/transactions.page";

const Routes = () => {
  return (
    <Router>
      <Switch>
        {/* Landding Page */}
        <Route path="/" exact component={LandingPage} />

        {/* CUSTOMER ROUTE */}
        <Route path="/customer/home" component={HomePage} />
        <Route path="/customer/book/:_id" component={MenuPage} />
        <Route path="/customer/book" component={BookPage} />

        <Route path="/customer/cart" component={CartPage} />

        <Redirect from="/customer*" to="/customer/home" />

        {/* ADMIN ROUTE */}
        <Route path="/admin/login" component={LoginPage} />

        <PrivateRoute path="/admin/menus" component={MenusPage} role="admin" />
        <PrivateRoute
          path="/admin/categories"
          component={CategoriesPage}
          role="admin"
        />
        <PrivateRoute
          path="/admin/tables"
          component={TablesPage}
          role="admin"
        />
        <PrivateRoute
          path="/admin/accounts"
          component={AccountsPage}
          role="admin"
        />
        <PrivateRoute
          path="/admin/dashboard"
          component={DashboardPage}
          role="admin"
        />
        <PrivateRoute
          path="/admin/transactions"
          component={TransactionsPage}
          role="admin"
        />
        {/* Redirect */}
        <Redirect from="/admin*" to="/admin/dashboard" />

        <Redirect from="/*" to="/" />
      </Switch>
    </Router>
  );
};

export default Routes;
