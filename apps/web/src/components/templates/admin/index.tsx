import { useEffect, useState, type ReactNode } from "react";
import { makeStyles } from "@material-ui/core";
import AppBarAdmin from "./appBar";
import DrawerAdmin from "./drawer";
import Copyright from "../copyright";

type AdminTemplateProps = {
  title?: string;
  children?: ReactNode;
};

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

const AdminTemplate = ({ title, children }: AdminTemplateProps) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    document.title = title || "Title";
  }, [title]);

  return (
    <div className={classes.root}>
      <AppBarAdmin
        openMobileDrawer={isMobileDrawerOpen}
        setOpenMobileDrawer={setIsMobileDrawerOpen}
      />
      <DrawerAdmin
        openMobileDrawer={isMobileDrawerOpen}
        setOpenMobileDrawer={setIsMobileDrawerOpen}
      />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <section className={classes.children}>{children}</section>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
      </main>
    </div>
  );
};

export default AdminTemplate;
