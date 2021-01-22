/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import useNetwork from "./components/hooks/use.network";
import NotificationCustom from "./components/common/notification.custom";
import LoadingCustom from "./components/common/loading.custom";
import Routes from "./routes";
import { Provider, useDispatch, useSelector } from "react-redux";
import Store from "./store";
import { Grid } from "@material-ui/core";
import {
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@material-ui/core";
import Actions from "./actions";
import { io } from "socket.io-client";
import Const from "./constant/const";

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

const InitCheck = ({ children }) => {
  const Authentication = useSelector((state) => state.Authentication.mount);
  const Menus = useSelector((state) => state.Menus.mount);
  const Categories = useSelector((state) => state.Categories.mount);
  const Accounts = useSelector((state) => state.Accounts.mount);
  const Orders = useSelector((state) => state.Orders.mount);
  const Tables = useSelector((state) => state.Tables.mount);
  const Roles = useSelector((state) => state.Roles.mount);
  const Transactions = useSelector((state) => state.Transactions.mount);
  const Customers = useSelector((state) => state.Customers.mount);
  // const Favorites = useSelector((state) => state.Favorites.mount);
  const dispatch = useDispatch();

  const InitRedux = async () => {
    await dispatch(Actions.Authentication.onMount());
    await dispatch(Actions.Tables.onMount());
    await dispatch(Actions.Accounts.onMount());
    await dispatch(Actions.Customers.onMount());
    await dispatch(Actions.Transactions.onMount());
    await dispatch(Actions.Orders.onMount());
    dispatch(Actions.Menus.onMount());
    dispatch(Actions.Categories.onMount());
    dispatch(Actions.Roles.onMount());

    dispatch(Actions.Favorites.onMount());
  };

  useEffect(() => {
    InitRedux();
  }, []);

  if (
    !Authentication &&
    !Menus &&
    !Categories &&
    !Accounts &&
    !Orders &&
    !Tables &&
    !Roles &&
    !Transactions &&
    !Customers
  ) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <LoadingCustom />;
      </Grid>
    );
  } else {
    return <div>{children}</div>;
  }
};

const Logic = ({ children }) => {
  const dispatch = useDispatch();
  const socket = io(Const.BASE_URL);

  useEffect(() => {
    socket.on("AccountsUpdate", (socket) => {
      console.log(socket);
      dispatch(Actions.Accounts.onLoad());
    });

    socket.on("MenusUpdate", (socket) => {
      console.log(socket);
      dispatch(Actions.Menus.onLoad());
    });

    socket.on("CategoriesUpdate", (socket) => {
      console.log(socket);
      dispatch(Actions.Categories.onLoad());
    });

    socket.on("OrdersUpdate", (socket) => {
      console.log(socket);
      dispatch(Actions.Transactions.onLoad());
      dispatch(Actions.Orders.onLoad());
    });

    socket.on("TablesUpdate", (socket) => {
      console.log(socket);
      dispatch(Actions.Tables.onLoad());
    });

    socket.on("RolesUpdate", (socket) => {
      console.log(socket);
      dispatch(Actions.Roles.onLoad());
    });

    socket.on("TransactionsUpdate", (socket) => {
      console.log(socket);
      dispatch(Actions.Orders.onLoad());
      dispatch(Actions.Transactions.onLoad());
    });

    socket.on("CustomersUpdate", (socket) => {
      console.log(socket);
      dispatch(Actions.Customers.onLoad());
    });
  }, []);

  return <div>{children}</div>;
};

const App = () => {
  return (
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
};

export default App;
