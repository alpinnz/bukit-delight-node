/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import { Typography, Grid } from "@material-ui/core";

const Overview = () => {
  const { width } = useWindowDimensions();

  const margin = width * 0.025;
  return (
    <>
      <Typography
        style={{ color: "#288806", paddingTop: 30 }}
        variant="h4"
        align="center"
      >
        Logo Bukit Delight
      </Typography>
      <Typography style={{ color: "#000000", paddingTop: 15 }} align="center">
        Pesananmu akan tiba dalam
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 30,
        }}
      >
        <div
          style={{
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: 300,
            height: 50,
            borderRadius: 8,
            position: "relative",
          }}
        >
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={1} sm={1}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography
                  style={{ color: "#000000" }}
                  align="center"
                  variant="h3"
                >
                  --
                </Typography>
              </div>
            </Grid>
            <Grid item xs={2} sm={1}>
              <Typography
                style={{ color: "#000000" }}
                align="center"
                variant="h3"
              >
                :
              </Typography>
            </Grid>
            <Grid item xs={1} sm={1}>
              <Typography
                style={{ color: "#000000" }}
                align="center"
                variant="h3"
              >
                --
              </Typography>
            </Grid>
          </Grid>
        </div>
      </div>
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={4} sm={2}>
          <div
            style={{
              backgroundColor: "#D95C17",
              height: 130,
              marginRight: margin / 2,
              borderRadius: 9,
            }}
          >
            <div
              style={{
                backgroundColor: "#632F11",
                height: 28,
                borderTopLeftRadius: 9,
                borderTopRightRadius: 9,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography style={{ color: "#FFFFFF" }} align="center">
                No. Meja
              </Typography>
            </div>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                height: 4,
              }}
            />
          </div>
        </Grid>
        <Grid item xs={8} sm={6}>
          <div
            style={{
              backgroundColor: "#FF833D",
              height: 130,
              marginLeft: margin / 2,
              borderRadius: 9,
              position: "relative",
            }}
          >
            <div
              style={{
                backgroundColor: "#632F11",
                height: 28,
                borderTopLeftRadius: 9,
                borderTopRightRadius: 9,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography style={{ color: "#FFFFFF" }} align="center">
                No. Antrian
              </Typography>
            </div>
            <div
              style={{
                backgroundColor: "#FFFFFF",
                height: 4,
              }}
            />
          </div>
        </Grid>
      </Grid>
    </>
  );
};

export default Overview;
