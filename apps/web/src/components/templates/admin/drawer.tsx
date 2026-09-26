import type { Dispatch, SetStateAction } from "react";
import {
  Drawer,
  Hidden,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Link } from "react-router-dom";

type AdminDrawerProps = {
  openMobileDrawer: boolean;
  setOpenMobileDrawer: Dispatch<SetStateAction<boolean>>;
};

const drawerWidth = 180;
const categories = [
  "Dashboard",
  "Transactions",
  "Categories",
  "Menus",
  "Tables",
  "Accounts",
  "Pemesanan",
];

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  grow: {
    flexGrow: 1,
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
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
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  closeMenuButton: {
    marginRight: "auto",
    marginLeft: 0,
  },
}));

const AdminDrawer = ({
  openMobileDrawer,
  setOpenMobileDrawer,
}: AdminDrawerProps) => {
  const classes = useStyles();
  const theme = useTheme();
  const pathSegments = window.location.pathname.toLowerCase().split("/");
  const closeMobileDrawer = () => setOpenMobileDrawer((isOpen) => !isOpen);

  const drawerContent = (
    <List>
      {categories.map((category) => {
        const route = category.toLowerCase();
        return (
          <ListItem
            selected={pathSegments[2] === route}
            button
            component={Link}
            to={`/admin/${route}`}
            key={category}
          >
            <ListItemText primary={category} />
          </ListItem>
        );
      })}
    </List>
  );

  return (
    <nav className={classes.drawer}>
      <Hidden smUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={openMobileDrawer}
          onClose={closeMobileDrawer}
          classes={{ paper: classes.drawerPaper }}
          ModalProps={{ keepMounted: true }}
        >
          <IconButton
            onClick={closeMobileDrawer}
            className={classes.closeMenuButton}
            aria-label="Close drawer"
          >
            <CloseIcon />
          </IconButton>
          {drawerContent}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <div className={classes.toolbar} />
          {drawerContent}
        </Drawer>
      </Hidden>
    </nav>
  );
};

export default AdminDrawer;
