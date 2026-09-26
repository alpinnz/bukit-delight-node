import { useState, type MouseEvent } from "react";
import {
  AppBar,
  Badge,
  Button,
  Divider,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../actions";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";

type AppBarKasirProps = { title: string };

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = Boolean(anchorEl);

  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);
  const logout = () => dispatch(Actions.Authentication.onLogout());

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
        <MenuItem onClick={logout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

const MenuNotifications = () => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);

  return (
    <div>
      <IconButton
        className={classes.button}
        onClick={openMenu}
        color="inherit"
        aria-label="notifications"
      >
        <Badge badgeContent={17} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isOpen}
        onClose={closeMenu}
      >
        <MenuItem onClick={closeMenu}>Notifications</MenuItem>
        <Divider />
        <MenuItem onClick={closeMenu}>1</MenuItem>
      </Menu>
    </div>
  );
};

const AppBarKasir = ({ title }: AppBarKasirProps) => {
  const account = useSelector(
    (state: RootState) => state.Authentication.account,
  );
  const classes = useStyles();

  return (
    <AppBar
      position="static"
      style={{ backgroundColor: "#CF672E", boxShadow: "none" }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.button}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {title}
        </Typography>
        <MenuNotifications />
        {account && <MenuAccount />}
      </Toolbar>
    </AppBar>
  );
};

export default AppBarKasir;
