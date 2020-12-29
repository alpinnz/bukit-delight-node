/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import ArrowBackIcon from "@material-ui/icons/ArrowBackIos";
import { Link } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";

const AppBar = ({ hight, routeName, title }) => {
  return (
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
          <Link to={`${routeName || "/"}`}>
            <ArrowBackIcon style={{ color: "#000000" }} />
          </Link>
        </Grid>

        <Grid item xs={8} sm={8}>
          <Typography
            style={{ color: "#000000" }}
            align={"center"}
          >{`${title}`}</Typography>
        </Grid>
        <Grid item xs={2} sm={2}></Grid>
      </Grid>
    </div>
  );
};

export default AppBar;
