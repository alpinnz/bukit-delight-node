/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

import useWindowDimensions from "./../../hooks/useWindowDimensions";
import { Typography } from "@material-ui/core";

const Recipe = ({ data }) => {
  const { width } = useWindowDimensions();

  const margin = width * 0.025;
  var RecipeData = data.reduce(function (previousValue, currentValue) {
    return {
      promo: previousValue.promo + currentValue.promo,
      total: previousValue.total + currentValue.total,
    };
  });

  return (
    <div
      style={{
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        backgroundColor: "#FFFFFF66",
        borderRadius: 8,
        justifyItems: "center",
        paddingBottom: margin,
        paddingTop: margin,
        paddingLeft: margin,
        paddingRight: margin,
      }}
    >
      {RecipeData.promo ? (
        <>
          <div
            style={{
              display: "flex",
              width: "100%",
              paddingLeft: margin,
              paddingRight: margin,
              // justifyContent: "space-between",
            }}
          >
            <div style={{ width: "40%", textAlign: "left" }}>
              <Typography style={{ color: "#000000" }} align="left">
                Harga Awal
              </Typography>
            </div>
            <div style={{ width: "60%", textAlign: "right" }}>
              <Typography
                variant="h6"
                style={{
                  color: "#000000",
                  textDecorationLine: "line-through",
                }}
                align="right"
              >
                {`${RecipeData.promo + RecipeData.total}`}
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              paddingLeft: margin,
              paddingRight: margin,
              // justifyContent: "space-between",
            }}
          >
            <div style={{ width: "30%", textAlign: "left" }}>
              <Typography style={{ color: "#1FA845" }} align="left">
                Promo
              </Typography>
            </div>
            <div style={{ width: "70%", textAlign: "right" }}>
              <Typography style={{ color: "#1FA845" }} align="right">
                {`${RecipeData.promo}`}
              </Typography>
            </div>
          </div>
        </>
      ) : (
        <div />
      )}

      <div
        style={{
          display: "flex",
          width: "100%",
          paddingLeft: margin,
          paddingRight: margin,
          // justifyContent: "space-between",
        }}
      >
        <div style={{ width: "30%", textAlign: "left" }}>
          <Typography style={{ color: "#000000" }} align="left">
            Total
          </Typography>
        </div>
        <div style={{ width: "70%", textAlign: "right" }}>
          <Typography variant="h4" style={{ color: "#000000" }} align="right">
            {`${RecipeData.total}`}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
