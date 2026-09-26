import { Button, Grid, makeStyles } from "@material-ui/core";
import Sidebar from "./sidebar";
import ContentLeft from "./desktop-menu-panel";
import Banner from "../components/laptop-banner";
import CustomerDesktopCartContent from "./cart/desktop-content";
import Icons from "../../../assets/icons";

const useStyles = makeStyles({ root: { flexGrow: 1 } });

const CustomerLaptopPage = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item md={2} lg={2} xl={2}>
          <Sidebar />
        </Grid>
        <Grid item md={6} lg={6} xl={6}>
          <Banner />
          <ContentLeft />
        </Grid>
        <Grid item md={4} lg={4} xl={4}>
          <div
            style={{
              display: "flex",
              height: "10vh",
              position: "relative",
              alignItems: "center",
              justifyContent: "space-around",
              backgroundColor: "#FFFFFF",
            }}
          >
            <Button>
              <img
                style={{ height: "5vh" }}
                src={Icons.laptop_plater}
                alt="laptop_plater"
              />
            </Button>
            <Button>
              <img
                style={{ height: "5vh" }}
                src={Icons.laptop_cart}
                alt="laptop_cart"
              />
            </Button>
          </div>
          <CustomerDesktopCartContent />
        </Grid>
      </Grid>
    </div>
  );
};

export default CustomerLaptopPage;
