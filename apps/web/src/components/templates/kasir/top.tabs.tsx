import { type ChangeEvent } from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import HomeIcon from "@material-ui/icons/Home";
import InputIcon from "@material-ui/icons/Input";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useHistory } from "react-router-dom";
import useWindowDimensions from "../../hooks/use.window.dimensions";

type CashierTabsProps = { tabActive: number };

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  indicator: {
    backgroundColor: "transparent",
  },
});

const CashierTabs = ({ tabActive }: CashierTabsProps) => {
  const classes = useStyles();
  const { width } = useWindowDimensions();
  const history = useHistory();

  const navigateToTab = (_event: ChangeEvent<{}>, tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        history.push("/kasir/home");
        break;
      case 1:
        history.push("/kasir/orders");
        break;
      case 2:
        history.push("/kasir/transactions");
        break;
      default:
        break;
    }
  };

  return (
    <div
      className={classes.root}
      style={{ backgroundColor: "transparent", boxShadow: "none" }}
    >
      <AppBar
        style={{ backgroundColor: "transparent", boxShadow: "none" }}
        position="static"
      >
        <Tabs
          value={tabActive}
          onChange={navigateToTab}
          aria-label="Cashier pages"
          style={{
            backgroundColor: "transparent",
            boxShadow: "none",
            display: "flex",
            justifyContent: "center",
          }}
          classes={classes}
        >
          <Tab
            style={{
              width: "33.3333333vw",
              maxWidth: width ?? undefined,
              backgroundColor: "#CF672E",
            }}
            label="Home"
            icon={<HomeIcon />}
          />
          <Tab
            style={{
              width: "33.3333333vw",
              maxWidth: width ?? undefined,
              backgroundColor: "#CF672E",
            }}
            label="Orders"
            icon={<InputIcon />}
          />
          <Tab
            style={{
              width: "33.3333333vw",
              maxWidth: width ?? undefined,
              backgroundColor: "#CF672E",
            }}
            label="Transactions"
            icon={<AssignmentIcon />}
          />
        </Tabs>
      </AppBar>
    </div>
  );
};

export default CashierTabs;
