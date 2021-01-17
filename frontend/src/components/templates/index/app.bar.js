import React from "react";
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Button,
  MenuItem,
  Menu,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Convert from "./../../../helpers/convert";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();
  const account = useSelector((state) => state.Authentication.account);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const onLogout = () => {
    setAnchorEl(null);
    dispatch(Actions.Authentication.onLogout());
  };
  const open = Boolean(anchorEl);

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
        <MenuItem to={`/${account.role}`} component={Link}>
          {Convert.Capitals(account.role)}
        </MenuItem>
        <MenuItem onClick={onLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

const AppBarIndex = (props) => {
  const { title } = props;
  const account = useSelector((state) => state.Authentication.account);
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
