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
  const Authentication = useSelector((state) => state.Authentication);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Actions.Authentication.onMount());
  }, []);

  if (Authentication.mount) {
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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <CssBaseline />
        <Provider store={Store}>
          <InitCheck>
            <NetworkStatusView />
            <NotificationCustom />
            <Routes />
          </InitCheck>
        </Provider>
      </div>
    </ThemeProvider>
  );
};

export default App;
