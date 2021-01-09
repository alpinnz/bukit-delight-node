import * as React from "react";
import { makeStyles } from "@material-ui/core";
import AppBarBasic from "./appBar";
import DrawerBasic from "./drawer";
import Copyright from "./../copyright";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(2),
  },
  children: { minHeight: "80vh" },
  footer: {
    paddingTop: theme.spacing(2),
  },
}));

function AdminIndex({ title, children }) {
  const [openMobileDrawer, setOpenMobileDrawer] = React.useState(false);

  const classes = useStyles();

  React.useEffect(() => {
    document.title = `${title || "Title"}`;
  }, [title]);

  return (
    <div className={classes.root}>
      <AppBarBasic
        openMobileDrawer={openMobileDrawer}
        setOpenMobileDrawer={setOpenMobileDrawer}
      />
      <DrawerBasic
        openMobileDrawer={openMobileDrawer}
        setOpenMobileDrawer={setOpenMobileDrawer}
      />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <section className={classes.children}>{children && children}</section>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
      </main>
    </div>
  );
}

export default AdminIndex;
