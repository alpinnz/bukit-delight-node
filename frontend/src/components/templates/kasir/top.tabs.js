import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import HomeIcon from "@material-ui/icons/Home";
import InputIcon from "@material-ui/icons/Input";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useHistory } from "react-router-dom";
import UseWindowDimensions from "./../../hooks/use.window.dimensions";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  indicator: {
    backgroundColor: "transparent",
  },
});

export default function ScrollableTabsButtonForce(props) {
  const { tabActive } = props;
  const classes = useStyles();
  const { width } = UseWindowDimensions();
  const history = useHistory();

  const handleChange = (event, newValue) => {
    switch (newValue) {
      case 0:
        return history.push("/kasir/home");
      case 1:
        return history.push("/kasir/orders");
      case 2:
        return history.push("/kasir/transactions");
      default:
        return null;
    }
  };

  return (
    <div
      className={classes.root}
      style={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <AppBar
        style={{
          backgroundColor: "transparent",
          boxShadow: "none",
        }}
        position="static"
      >
        <Tabs
          value={tabActive}
          onChange={handleChange}
          aria-label="simple tabs example"
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
              maxWidth: width,
              backgroundColor: "#CF672E",
            }}
            label="Home"
            icon={<HomeIcon />}
          />
          <Tab
            style={{
              width: "33.3333333vw",
              maxWidth: width,
              backgroundColor: "#CF672E",
            }}
            label="Orders"
            icon={<InputIcon />}
          />
          <Tab
            style={{
              width: "33.3333333vw",
              maxWidth: width,
              backgroundColor: "#CF672E",
            }}
            label="Transactions"
            icon={<AssignmentIcon />}
          />
        </Tabs>
      </AppBar>
    </div>
  );
}
