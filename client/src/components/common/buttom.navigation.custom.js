import * as React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Icons from "./../../assets/icons";

const useStyles = makeStyles({
  root: {
    color: "green",
    // "&$selected": {
    //   color: "red",
    // },
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
  let history = useHistory();

  const onChange = (i) => {
    switch (i) {
      case 0:
        return history.push("/customer/cart");
      case 1:
        return history.push("/customer/book");
      case 2:
        return history.push("/customer/home");
      default:
        return null;
    }
  };

  return (
    <BottomNavigation value={selected} className={classes.root}>
      <BottomNavigationAction
        onClick={() => onChange(0)}
        icon={
          selected === 0 ? (
            <img src={Icons.cart_active} alt="cart_active" />
          ) : (
            <img src={Icons.cart} alt="book" />
          )
        }
      />
      <BottomNavigationAction
        onClick={() => onChange(1)}
        icon={
          selected === 1 ? (
            <img src={Icons.book_active} alt="book_active" />
          ) : (
            <img src={Icons.book} alt="book" />
          )
        }
      />
      <BottomNavigationAction
        onClick={() => onChange(2)}
        icon={
          selected === 2 ? (
            <img src={Icons.home_active} alt="home_active" />
          ) : (
            <img src={Icons.home} alt="home" />
          )
        }
      />
    </BottomNavigation>
  );
};

export default BottomNavigationCustom;
