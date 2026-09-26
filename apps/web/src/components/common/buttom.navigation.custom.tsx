import { makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Icons from "../../assets/icons";

type BottomNavigationCustomProps = { selected?: number };

const useStyles = makeStyles({
  root: {
    color: "green",
    backgroundColor: "#CF672E",
    borderRadius: 32,
    position: "fixed",
    bottom: 5,
    right: 5,
    left: 5,
  },
});

const BottomNavigationCustom = ({ selected }: BottomNavigationCustomProps) => {
  const classes = useStyles();
  const history = useHistory();

  const onChange = (index: number) => {
    const routes = ["/customer/cart", "/customer/book", "/customer/home"];
    const route = routes[index];
    if (route) history.push(route);
  };

  return (
    <BottomNavigation value={selected} className={classes.root}>
      <BottomNavigationAction
        aria-label="Cart"
        onClick={() => onChange(0)}
        icon={
          <img
            src={selected === 0 ? Icons.cart_active : Icons.cart}
            alt={selected === 0 ? "cart_active" : "book"}
          />
        }
      />
      <BottomNavigationAction
        aria-label="Book"
        onClick={() => onChange(1)}
        icon={
          <img
            src={selected === 1 ? Icons.book_active : Icons.book}
            alt={selected === 1 ? "book_active" : "book"}
          />
        }
      />
      <BottomNavigationAction
        aria-label="Home"
        onClick={() => onChange(2)}
        icon={
          <img
            src={selected === 2 ? Icons.home_active : Icons.home}
            alt={selected === 2 ? "home_active" : "home"}
          />
        }
      />
    </BottomNavigation>
  );
};

export default BottomNavigationCustom;
