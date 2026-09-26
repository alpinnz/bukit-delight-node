import {
  useState,
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
} from "react";
import {
  AppBar,
  Badge,
  Button,
  Divider,
  Hidden,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import MenuIcon from "@material-ui/icons/Menu";
import MoreIcon from "@material-ui/icons/MoreVert";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { useDispatch, useSelector } from "react-redux";
import Actions from "../../../actions";
import type { RootState } from "../../../reducers";
import type { AppDispatch } from "../../../store";

type AppBarAdminProps = {
  openMobileDrawer: boolean;
  setOpenMobileDrawer: Dispatch<SetStateAction<boolean>>;
};
type AnchorMenuProps = {
  anchorEl: HTMLElement | null;
  onClose: () => void;
};
type MobileNotificationsProps = {
  onClose: Dispatch<SetStateAction<HTMLElement | null>>;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  grow: {
    flexGrow: 1,
  },
  button: {
    marginRight: theme.spacing(2),
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  closeMenuButton: {
    marginRight: "auto",
    marginLeft: 0,
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const MenuAccount = () => {
  const account = useSelector(
    (state: RootState) => state.Authentication.account,
  );
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = Boolean(anchorEl);

  const logout = () => dispatch(Actions.Authentication.onLogout());
  const openMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);

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
        aria-label="Notifications"
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

const MenuItemNotifications = ({ onClose }: MobileNotificationsProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isOpen = Boolean(anchorEl);

  const openMenu = (event: MouseEvent<HTMLLIElement>) => {
    onClose(null);
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => setAnchorEl(null);

  return (
    <div>
      <MenuItem onClick={openMenu}>
        <IconButton color="inherit" aria-label="Open notifications">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
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

const AdminMenu = ({ anchorEl, onClose }: AnchorMenuProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const logout = () => dispatch(Actions.Authentication.onLogout());

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id="primary-search-account-menu"
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={logout}>Logout</MenuItem>
    </Menu>
  );
};

const AdminMobileMenu = ({
  anchorEl,
  onClose,
}: AnchorMenuProps & { onClose: () => void }) => {
  const dispatch = useDispatch<AppDispatch>();
  const logout = () => dispatch(Actions.Authentication.onLogout());

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id="primary-search-account-menu-mobile"
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItemNotifications onClose={() => onClose()} />
      <MenuItem onClick={logout}>
        <IconButton color="inherit" aria-label="Logout">
          <ExitToAppIcon />
        </IconButton>
        <p>Logout</p>
      </MenuItem>
    </Menu>
  );
};

const AppBarAdmin = ({
  openMobileDrawer,
  setOpenMobileDrawer,
}: AppBarAdminProps) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<HTMLElement | null>(null);

  const closeMobileMenu = () => setMobileMoreAnchorEl(null);
  const closeMenu = () => {
    setAnchorEl(null);
    closeMobileMenu();
  };
  const openMobileMenu = (event: MouseEvent<HTMLButtonElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            edge="start"
            onClick={() => setOpenMobileDrawer(!openMobileDrawer)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Bukit Delight
          </Typography>
          <div className={classes.grow} />
          <div
            style={{ alignItems: "center" }}
            className={classes.sectionDesktop}
          >
            <MenuNotifications />
            <MenuAccount />
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls="primary-search-account-menu-mobile"
              aria-haspopup="true"
              onClick={openMobileMenu}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
        <Hidden smUp implementation="css" />
        <Hidden xsDown implementation="css" />
      </AppBar>
      <AdminMobileMenu
        anchorEl={mobileMoreAnchorEl}
        onClose={closeMobileMenu}
      />
      <AdminMenu anchorEl={anchorEl} onClose={closeMenu} />
    </>
  );
};

export default AppBarAdmin;
