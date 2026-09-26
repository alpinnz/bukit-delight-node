import { useEffect, type ReactNode } from "react";
import { Grid } from "@material-ui/core";
import {
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@material-ui/core";
import { Provider, useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import Actions from "./actions";
import NotificationCustom from "./components/common/notification.custom";
import LoadingCustom from "./components/common/loading.custom";
import useNetwork from "./components/hooks/use.network";
import Const from "./constant/const";
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

let theme = createMuiTheme({
  typography: {
    fontFamily: `'Roboto', sans-serif`,
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [],
      },
    },
  },
});

theme = responsiveFontSizes(theme);

const InitCheck = ({ children }: { children: ReactNode }) => {
  const authenticationMounted = useSelector(
    (state: RootState) => state.Authentication.mount,
  );
  const menusMounted = useSelector((state: RootState) => state.Menus.mount);
  const categoriesMounted = useSelector(
    (state: RootState) => state.Categories.mount,
  );
  const accountsMounted = useSelector(
    (state: RootState) => state.Accounts.mount,
  );
  const ordersMounted = useSelector((state: RootState) => state.Orders.mount);
  const tablesMounted = useSelector((state: RootState) => state.Tables.mount);
  const rolesMounted = useSelector((state: RootState) => state.Roles.mount);
  const transactionsMounted = useSelector(
    (state: RootState) => state.Transactions.mount,
  );
  const customersMounted = useSelector(
    (state: RootState) => state.Customers.mount,
  );
  const dispatch = useDispatch<AppDispatch>();

  const initializeRedux = async () => {
    await dispatch(Actions.Authentication.onMount());
    await dispatch(Actions.Tables.onMount());
    await dispatch(Actions.Menus.onMount());
    await dispatch(Actions.Categories.onMount());

    const account = JSON.parse(localStorage.getItem("account") || "null");
    const customer = JSON.parse(localStorage.getItem("customer") || "null");

    if (account) {
      await dispatch(Actions.Accounts.onMount());
      await dispatch(Actions.Transactions.onMount());
      await dispatch(Actions.Orders.onMount());
      dispatch(Actions.Roles.onMount());
      dispatch(Actions.Favorites.onMount());
    } else if (customer) {
      await dispatch(Actions.Customers.onMount());
      await dispatch(Actions.Orders.onMount());
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
    transactionsMounted ||
    customersMounted;

  if (!isInitialized) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <LoadingCustom />
      </Grid>
    );
  }

  return <div>{children}</div>;
};

const Logic = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const socket = io(Const.BASE_URL);
    const onAccountsUpdate = () => dispatch(Actions.Accounts.onLoad());
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
    const onCustomersUpdate = () => dispatch(Actions.Customers.onLoad());

    socket.on("AccountsUpdate", onAccountsUpdate);
    socket.on("MenusUpdate", onMenusUpdate);
    socket.on("CategoriesUpdate", onCategoriesUpdate);
    socket.on("OrdersUpdate", onOrdersUpdate);
    socket.on("TablesUpdate", onTablesUpdate);
    socket.on("RolesUpdate", onRolesUpdate);
    socket.on("TransactionsUpdate", onTransactionsUpdate);
    socket.on("CustomersUpdate", onCustomersUpdate);

    return () => {
      socket.off("AccountsUpdate", onAccountsUpdate);
      socket.off("MenusUpdate", onMenusUpdate);
      socket.off("CategoriesUpdate", onCategoriesUpdate);
      socket.off("OrdersUpdate", onOrdersUpdate);
      socket.off("TablesUpdate", onTablesUpdate);
      socket.off("RolesUpdate", onRolesUpdate);
      socket.off("TransactionsUpdate", onTransactionsUpdate);
      socket.off("CustomersUpdate", onCustomersUpdate);
      socket.disconnect();
    };
  }, [dispatch]);

  return <div>{children}</div>;
};

const App = () => (
  <ThemeProvider theme={theme}>
    <div className="App">
      <CssBaseline />
      <Provider store={Store}>
        <InitCheck>
          <NetworkStatusView />
          <NotificationCustom />
          <Logic>
            <Routes />
          </Logic>
        </InitCheck>
      </Provider>
    </div>
  </ThemeProvider>
);

export default App;
