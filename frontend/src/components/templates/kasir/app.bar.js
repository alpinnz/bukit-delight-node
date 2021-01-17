import React from "react";
import {
  Menu,
  MenuItem,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Badge,
  Divider,
} from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import MenuIcon from "@material-ui/icons/Menu";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../../actions";

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
  const account = useSelector((state) => state.Authentication.account);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(Actions.Authentication.onLogout());
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-label="account of current user"
        aria-controls="menu-appbar"
        variant="text"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        {account.username}
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

const MenuNotifications = () => {
  // const account = useSelector((state) => state.Authentication.account);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        className={classes.button}
        onClick={handleMenu}
        color="inherit"
      >
        <Badge badgeContent={17} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Notifications</MenuItem>
        <Divider />
        <MenuItem onClick={handleClose}>1</MenuItem>
      </Menu>
    </div>
  );
};

const AppBarKasir = (props) => {
  const account = useSelector((state) => state.Authentication.account);
  const { title } = props;
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
