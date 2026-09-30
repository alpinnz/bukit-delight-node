import { useEffect, type ReactNode } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Actions from "./actions";
import Toast from "./components/molecules/toast";
import LoadingIndicator from "./components/atoms/loading-indicator";
import useNetwork from "./hooks/use-network";
import apiConfig from "./config/api-config";
import type { RootState } from "./reducers";
import Store, { type AppDispatch } from "./store";
import Routes from "./routes";

const NetworkStatusView = () => {
  const isNetwork = useNetwork();

  return (
    <div>
      {!isNetwork && (
        <div className="internet-error">
          <p>Internet connection lost</p>
        </div>
      )}
    </div>
  );
};

const InitCheck = ({ children }: { children: ReactNode }) => {
  const authenticationMounted = useSelector(
    (state: RootState) => state.Authentication.mount,
  );
  const menusMounted = useSelector((state: RootState) => state.Menus.mount);
  const categoriesMounted = useSelector(
    (state: RootState) => state.Categories.mount,
  );
  const accountsMounted = useSelector(
    (state: RootState) => state.Users.mount,
  );
  const ordersMounted = useSelector((state: RootState) => state.Orders.mount);
  const tablesMounted = useSelector((state: RootState) => state.Tables.mount);
  const rolesMounted = useSelector((state: RootState) => state.Roles.mount);
  const transactionsMounted = useSelector(
    (state: RootState) => state.Transactions.mount,
  );
  const dispatch = useDispatch<AppDispatch>();

  const initializeRedux = async () => {
    await dispatch(Actions.Authentication.onMount());
    await dispatch(Actions.Tables.onMount());
    await dispatch(Actions.Menus.onMount());
    await dispatch(Actions.Categories.onMount());

    const account = JSON.parse(localStorage.getItem("account") || "null");
    localStorage.removeItem("customer");

    if (account) {
      const role = `${account.role}`.toLowerCase();
      const roles: string[] = Array.isArray(account.roles)
        ? account.roles
        : [role];
      if (roles.includes("customer")) {
        dispatch(
          Actions.Customers.setCustomer({
            id: account.id,
            username: account.username,
          }),
        );
      } else {
        dispatch(Actions.Customers.cleanCustomer());
      }
      if (roles.includes("owner")) {
        await dispatch(Actions.Users.onMount());
        dispatch(Actions.Roles.onMount());
        dispatch(Actions.Favorites.onMount());
      }
      if (roles.some((item) => ["owner", "cashier"].includes(item))) {
        await dispatch(Actions.Transactions.onMount());
        await dispatch(Actions.Orders.onMount());
      } else if (roles.includes("customer")) {
        await dispatch(Actions.Orders.onMount());
      }
    } else {
      dispatch(Actions.Customers.cleanCustomer());
    }
  };

  useEffect(() => {
    initializeRedux();
  }, []);

  const isInitialized =
    authenticationMounted ||
    menusMounted ||
    categoriesMounted ||
    accountsMounted ||
    ordersMounted ||
    tablesMounted ||
    rolesMounted ||
    transactionsMounted;

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoadingIndicator />
      </div>
    );
  }

  return <div>{children}</div>;
};

const Logic = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const socket = io(apiConfig.baseUrl);
    const onUsersUpdate = () => dispatch(Actions.Users.onLoad());
    const onMenusUpdate = () => dispatch(Actions.Menus.onLoad());
    const onCategoriesUpdate = () => dispatch(Actions.Categories.onLoad());
    const onOrdersUpdate = () => {
      dispatch(Actions.Transactions.onLoad());
      dispatch(Actions.Orders.onLoad());
    };
    const onTablesUpdate = () => dispatch(Actions.Tables.onLoad());
    const onRolesUpdate = () => dispatch(Actions.Roles.onLoad());
    const onTransactionsUpdate = () => {
      dispatch(Actions.Orders.onLoad());
      dispatch(Actions.Transactions.onLoad());
    };

    socket.on("UsersUpdate", onUsersUpdate);
    socket.on("MenusUpdate", onMenusUpdate);
    socket.on("CategoriesUpdate", onCategoriesUpdate);
    socket.on("OrdersUpdate", onOrdersUpdate);
    socket.on("TablesUpdate", onTablesUpdate);
    socket.on("RolesUpdate", onRolesUpdate);
    socket.on("TransactionsUpdate", onTransactionsUpdate);

    return () => {
      socket.off("UsersUpdate", onUsersUpdate);
      socket.off("MenusUpdate", onMenusUpdate);
      socket.off("CategoriesUpdate", onCategoriesUpdate);
      socket.off("OrdersUpdate", onOrdersUpdate);
      socket.off("TablesUpdate", onTablesUpdate);
      socket.off("RolesUpdate", onRolesUpdate);
      socket.off("TransactionsUpdate", onTransactionsUpdate);
      socket.disconnect();
    };
  }, [dispatch]);

  return <div>{children}</div>;
};

const App = () => (
  <div className="App min-h-screen font-sans text-slate-900 antialiased">
    <Provider store={Store}>
      <InitCheck>
        <NetworkStatusView />
        <Toast />
        <Logic>
          <Routes />
        </Logic>
      </InitCheck>
    </Provider>
  </div>
);

export default App;
