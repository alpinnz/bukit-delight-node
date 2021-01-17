/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

const Recipe = () => {
  const data = useSelector((state) => state.Cart.data);
  const [state, setState] = useState({ promo: 0, total: 0 });

  const onLoad = async () => {
    const total_promo = await data.reduce((val, element) => {
      return val + Number(element.total_promo);
    }, 0);
    const total_price = await data.reduce((val, element) => {
      return val + Number(element.total_price);
    }, 0);
    setState({ promo: total_promo, total: total_price });
  };

  useEffect(() => {
    onLoad();
  }, [data]);

  return (
    <div
      style={{
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        backgroundColor: "#FFFFFF66",
        borderRadius: 8,
        justifyItems: "center",
        paddingBottom: "0.25rem",
        paddingTop: "0.25rem",
        paddingLeft: "0.25rem",
        paddingRight: "0.25rem",
      }}
    >
      {state.promo > 0 ? (
        <>
          <div
            style={{
              display: "flex",
              width: "100%",
              paddingLeft: "0.25rem",
              paddingRight: "0.25rem",
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
                {`${state.promo + state.total}`}
              </Typography>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              paddingLeft: "0.25rem",
              paddingRight: "0.25rem",
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
                {`${state.promo}`}
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
          paddingLeft: "0.25rem",
          paddingRight: "0.25rem",
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
            {`${state.total}`}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
