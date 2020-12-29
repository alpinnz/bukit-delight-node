import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import History from "./../helpers/history";

const useStyles = makeStyles({
  root: {
    color: "green",
    "&$selected": {
      color: "red",
    },
    backgroundColor: "#CF672E",
    borderRadius: 32,
    position: "fixed",
    bottom: 5,
    right: 5,
    left: 5,
  },
});

const BottomNavigationCustom = ({ selected }) => {
  const classes = useStyles();

  const onChange = (i) => {
    switch (i) {
      case 0:
        return History.push("/cart");
      case 1:
        return History.push("/book");
      case 2:
        return History.push("/");
      default:
        return null;
    }
  };

  return (
    <BottomNavigation
      value={selected}
      // onChange={(event, newValue) => onChange(newValue)}
      // showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        // classes={classes}
        // label="Cart"
        onClick={() => onChange(0)}
        icon={
          selected === 0 ? (
            <img
              src={"/assets/icons/cart-active.png"}
              // width="25"
              // height="27"
              alt="book"
            />
          ) : (
            <img
              src={"/assets/icons/cart.png"}
              // width="25"
              // height="27"
              alt="book"
            />
          )
        }
      />
      <BottomNavigationAction
        // classes={classes}
        // label="Book"
        onClick={() => onChange(1)}
        icon={
          selected === 1 ? (
            <img
              src={"/assets/icons/book-active.png"}
              // width="25"
              // height="27"
              alt="book"
            />
          ) : (
            <img
              src={"/assets/icons/book.png"}
              // width="25"
              // height="27"
              alt="book"
            />
          )
        }
      />
      <BottomNavigationAction
        // classes={classes}
        // label="Home"
        onClick={() => onChange(2)}
        icon={
          selected === 2 ? (
            <img
              src={"/assets/icons/home-active.png"}
              // width="25"
              // height="27"
              alt="book"
            />
          ) : (
            <img
              src={"/assets/icons/home.png"}
              // width="25"
              // height="27"
              alt="book"
            />
          )
        }
      />
    </BottomNavigation>
  );
};

export default BottomNavigationCustom;
