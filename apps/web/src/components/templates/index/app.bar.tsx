import { useState, type MouseEvent } from "react";
import {
  AppBar,
  Button,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Actions from "../../../actions";
import Convert from "../../../helpers/convert";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";

type AppBarIndexProps = { title: string };

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  button: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const MenuAccount = () => {
  const account = useSelector(
    (state: RootState) => state.Authentication.account,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);
  const logout = () => {
    closeMenu();
    dispatch(Actions.Authentication.onLogout());
  };

  if (!account) return null;

  return (
    <div>
      <Button
        aria-label="account of current user"
        aria-controls="menu-appbar"
        variant="text"
        aria-haspopup="true"
        onClick={openMenu}
        color="inherit"
      >
        {account.username}
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isOpen}
        onClose={closeMenu}
      >
        <MenuItem to={`/${account.role}`} component={Link}>
          {Convert.Capitals(account.role)}
        </MenuItem>
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

const AppBarIndex = ({ title }: AppBarIndexProps) => {
  const account = useSelector(
    (state: RootState) => state.Authentication.account,
  );
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <Button
            className={classes.button}
            to="/customer"
            component={Link}
            color="inherit"
          >
            Customer
          </Button>
          {account ? (
            <MenuAccount />
          ) : (
            <Button to="/login" component={Link} color="inherit">
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default AppBarIndex;
