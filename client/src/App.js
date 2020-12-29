import * as React from "react";
import {
  CssBaseline,
  createMuiTheme,
  ThemeProvider,
  responsiveFontSizes,
} from "@material-ui/core";
import { Provider } from "react-redux";
import Routes from "./routes";
import Store from "./redux";
import "./App.css";

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

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <CssBaseline />
        <Provider store={Store}>
          <Routes />
        </Provider>
      </div>
    </ThemeProvider>
  );
};

export default App;
