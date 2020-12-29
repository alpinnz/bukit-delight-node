import * as React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import AppBarBasic from "./appBar";
import DrawerBasic from "./drawer";
import Copyright from "./../copyright";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import Snackbar from "./../../snackbar";

function AdminIndex({ title, children }) {
  const [openMobileDrawer, setOpenMobileDrawer] = React.useState(false);
  const { height } = useWindowDimensions();

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
    },
    toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 1,
      padding: theme.spacing(2),
    },
    children: {
      minHeight: `${height * 0.8}px`,
    },
    footer: {
      paddingTop: theme.spacing(2),
    },
  }));
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
        <section className={classes.children}>
          {children ? (
            children
          ) : (
            <>
              <Typography paragraph>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Rhoncus dolor purus non enim praesent elementum facilisis leo
                vel. Risus at ultrices mi tempus imperdiet. Semper risus in
                hendrerit gravida rutrum quisque non tellus. Convallis convallis
                tellus id interdum velit laoreet id donec ultrices. Odio morbi
                quis commodo odio aenean sed adipiscing. Amet nisl suscipit
                adipiscing bibendum est ultricies integer quis. Cursus euismod
                quis viverra nibh cras. Metus vulputate eu scelerisque felis
                imperdiet proin fermentum leo. Mauris commodo quis imperdiet
                massa tincidunt. Cras tincidunt lobortis feugiat vivamus at
                augue. At augue eget arcu dictum varius duis at consectetur
                lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa
                sapien faucibus et molestie ac.
              </Typography>
              <Typography paragraph>
                Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
                ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
                elementum integer enim neque volutpat ac tincidunt. Ornare
                suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
                volutpat consequat mauris. Elementum eu facilisis sed odio
                morbi. Euismod lacinia at quis risus sed vulputate odio. Morbi
                tincidunt ornare massa eget egestas purus viverra accumsan in.
                In hendrerit gravida rutrum quisque non tellus orci ac.
                Pellentesque nec nam aliquam sem et tortor. Habitant morbi
                tristique senectus et. Adipiscing elit duis tristique
                sollicitudin nibh sit. Ornare aenean euismod elementum nisi quis
                eleifend. Commodo viverra maecenas accumsan lacus vel facilisis.
                Nulla posuere sollicitudin aliquam ultrices sagittis orci a.
              </Typography>
            </>
          )}
        </section>
        <footer className={classes.footer}>
          <Copyright />
        </footer>
        <Snackbar />
      </main>
    </div>
  );
}

export default AdminIndex;
