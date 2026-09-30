import { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes as RouteList,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./private.route";
import CustomersRoute from "./customers.route";
import LoadingIndicator from "../components/atoms/loading-indicator";

const LandingPage = lazy(() => import("../features/landing/pages"));
const CustomerHomePage = lazy(() => import("../features/customer/pages/home"));
const CustomerBookPage = lazy(() => import("../features/customer/pages/book"));
const CustomerMenuPage = lazy(() => import("../features/customer/pages/menu"));
const CustomerCartPage = lazy(() => import("../features/customer/pages/cart"));
const LoginPage = lazy(() => import("../features/auth/pages/login"));
const RegisterPage = lazy(() => import("../features/auth/pages/register"));
const ForgotPasswordPage = lazy(
  () => import("../features/auth/pages/forgot-password"),
);
const ResetPasswordPage = lazy(
  () => import("../features/auth/pages/reset-password"),
);
const CashierHomePage = lazy(() => import("../features/cashier/pages/home"));
const CashierMenusPage = lazy(() => import("../features/cashier/pages/menus"));
const CashierOrdersPage = lazy(
  () => import("../features/cashier/pages/orders"),
);
const CashierTransactionsPage = lazy(
  () => import("../features/cashier/pages/transactions"),
);
const OwnerDashboardPage = lazy(
  () => import("../features/owner/pages/dashboard"),
);
const OwnerFavoritesPage = lazy(
  () => import("../features/owner/pages/favorites"),
);
const OwnerMenusPage = lazy(() => import("../features/owner/pages/menus"));
const OwnerCategoriesPage = lazy(
  () => import("../features/owner/pages/categories"),
);
const OwnerTablesPage = lazy(() => import("../features/owner/pages/tables"));
const OwnerUsersPage = lazy(
  () => import("../features/owner/pages/users"),
);
const OwnerTransactionsPage = lazy(
  () => import("../features/owner/pages/transactions"),
);

const Routes = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingIndicator />}>
        <RouteList>
          {/* Landding Page */}
          <Route path="/" element={<LandingPage />} />
          {/* login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* CUSTOMER ROUTE */}
          <Route
            path="/customer/home"
            element={
              <CustomersRoute>
                <CustomerHomePage />
              </CustomersRoute>
            }
          />
          <Route
            path="/customer/book/:category_id"
            element={
              <CustomersRoute requireTable>
                <CustomerMenuPage />
              </CustomersRoute>
            }
          />
          <Route
            path="/customer/book"
            element={
              <CustomersRoute requireTable>
                <CustomerBookPage />
              </CustomersRoute>
            }
          />
          <Route
            path="/customer/cart"
            element={
              <CustomersRoute requireTable>
                <CustomerCartPage />
              </CustomersRoute>
            }
          />
          <Route
            path="/customer/*"
            element={<Navigate to="/login" replace />}
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
          {/* OWNER ROUTES */}
          <Route
            path="/owner/menus"
            element={
              <PrivateRoute role="owner">
                <OwnerMenusPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/categories"
            element={
              <PrivateRoute role="owner">
                <OwnerCategoriesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/tables"
            element={
              <PrivateRoute role="owner">
                <OwnerTablesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/users"
            element={
              <PrivateRoute role="owner">
                <OwnerUsersPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/dashboard"
            element={
              <PrivateRoute role="owner">
                <OwnerDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/transactions"
            element={
              <PrivateRoute role="owner">
                <OwnerTransactionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/favorites"
            element={
              <PrivateRoute role="owner">
                <OwnerFavoritesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/owner/*"
            element={<Navigate to="/owner/dashboard" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </RouteList>
      </Suspense>
    </Router>
  );
};

export default Routes;
