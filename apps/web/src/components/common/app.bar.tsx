import ArrowBackIcon from "@material-ui/icons/ArrowBackIos";
import { Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

type AppBarProps = {
  hight?: number;
  routeName?: string;
  title?: string;
};

const AppBar = ({ hight, routeName, title }: AppBarProps) => (
  <div
    style={{
      position: "fixed",
      backgroundColor: "#CCC1C1",
      justifyContent: "center",
      textAlign: "center",
      alignItems: "center",
      top: 0,
      right: 0,
      left: 0,
    }}
  >
    <Grid
      style={{
        justifyContent: "center",
        textAlign: "center",
        alignItems: "center",
        height: hight || 61,
      }}
      container
    >
      <Grid item xs={2} sm={2}>
        <Link to={routeName || "/"} aria-label="Back">
          <ArrowBackIcon style={{ color: "#000000" }} />
        </Link>
      </Grid>
      <Grid item xs={8} sm={8}>
        <Typography style={{ color: "#000000" }} align="center">
          {`${title}`}
        </Typography>
      </Grid>
      <Grid item xs={2} sm={2} />
    </Grid>
  </div>
);

export default AppBar;
