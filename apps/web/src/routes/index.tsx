import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as RouteList,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./private.route";
import CustomersRoute from "./customers.route";
import LoadingCustom from "../components/common/loading.custom";

const LandingPage = lazy(() => import("../features/landing/pages"));
const CustomerInitPage = lazy(() => import("../features/customer/pages/init"));
const CustomerHomePage = lazy(() => import("../features/customer/pages/home"));
const CustomerBookPage = lazy(() => import("../features/customer/pages/book"));
const CustomerMenuPage = lazy(() => import("../features/customer/pages/menu"));
const CustomerCartPage = lazy(() => import("../features/customer/pages/cart"));
const LoginPage = lazy(() => import("../features/auth/pages/login.page"));
const CashierHomePage = lazy(() => import("../features/cashier/pages/home"));
const CashierMenusPage = lazy(() => import("../features/cashier/pages/menus"));
const CashierOrdersPage = lazy(
  () => import("../features/cashier/pages/orders"),
);
const CashierTransactionsPage = lazy(
  () => import("../features/cashier/pages/transactions"),
);
const AdminDashboardPage = lazy(
  () => import("../features/admin/pages/dashboard"),
);
const AdminFavoritesPage = lazy(
  () => import("../features/admin/pages/favorites"),
);
const AdminMenusPage = lazy(() => import("../features/admin/pages/menus"));
const AdminCategoriesPage = lazy(
  () => import("../features/admin/pages/categories"),
);
const AdminTablesPage = lazy(() => import("../features/admin/pages/tables"));
const AdminAccountsPage = lazy(
  () => import("../features/admin/pages/accounts"),
);
const AdminTransactionsPage = lazy(
  () => import("../features/admin/pages/transactions"),
);

const Routes = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingCustom />}>
        <RouteList>
          {/* Landding Page */}
          <Route path="/" element={<LandingPage />} />
          {/* login */}
          <Route path="/login" element={<LoginPage />} />

          {/* CUSTOMER ROUTE */}
          <Route
            path="/customer/init/:tableName"
            element={<CustomerInitPage />}
          />
          <Route
            path="/customer/home"
            element={
              <CustomersRoute>
                <CustomerHomePage />
              </CustomersRoute>
            }
          />
          <Route
            path="/customer/book/:categoryId"
            element={
              <CustomersRoute>
                <CustomerMenuPage />
              </CustomersRoute>
            }
          />
          <Route
            path="/customer/book"
            element={
              <CustomersRoute>
                <CustomerBookPage />
              </CustomersRoute>
            }
          />
          <Route
            path="/customer/cart"
            element={
              <CustomersRoute>
                <CustomerCartPage />
              </CustomersRoute>
            }
          />
          <Route
            path="/customer/*"
            element={<Navigate to="/customer/home" replace />}
          />

          {/* CASHIER ROUTES */}
          <Route
            path="/cashier/home"
            element={
              <PrivateRoute role="cashier">
                <CashierHomePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cashier/menus"
            element={
              <PrivateRoute role="cashier">
                <CashierMenusPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cashier/orders"
            element={
              <PrivateRoute role="cashier">
                <CashierOrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cashier/transactions"
            element={
              <PrivateRoute role="cashier">
                <CashierTransactionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/cashier/*"
            element={<Navigate to="/cashier/home" replace />}
          />
          <Route
            path="/kasir/home"
            element={<Navigate to="/cashier/home" replace />}
          />
          <Route
            path="/kasir/menus"
            element={<Navigate to="/cashier/menus" replace />}
          />
          <Route
            path="/kasir/orders"
            element={<Navigate to="/cashier/orders" replace />}
          />
          <Route
            path="/kasir/transactions"
            element={<Navigate to="/cashier/transactions" replace />}
          />
          <Route
            path="/kasir/*"
            element={<Navigate to="/cashier/home" replace />}
          />

          {/* ADMIN ROUTE */}
          <Route
            path="/admin/menus"
            element={
              <PrivateRoute role="admin">
                <AdminMenusPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <PrivateRoute role="admin">
                <AdminCategoriesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/tables"
            element={
              <PrivateRoute role="admin">
                <AdminTablesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/accounts"
            element={
              <PrivateRoute role="admin">
                <AdminAccountsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute role="admin">
                <AdminDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/transactions"
            element={
              <PrivateRoute role="admin">
                <AdminTransactionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/favorites"
            element={
              <PrivateRoute role="admin">
                <AdminFavoritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/pemesanan"
            element={<Navigate to="/admin/favorites" replace />}
          />

          <Route
            path="/admin/*"
            element={<Navigate to="/admin/dashboard" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </RouteList>
      </Suspense>
    </Router>
  );
};

export default Routes;
