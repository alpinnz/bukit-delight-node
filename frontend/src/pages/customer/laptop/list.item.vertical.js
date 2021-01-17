/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import convert from "./../../../helpers/convert";
import { Typography, Button } from "@material-ui/core";
import Actions from "./../../../actions";
import { useSelector, useDispatch } from "react-redux";

const ListItemVertical = () => {
  const Cart = useSelector((state) => state.Cart);

  const ItemCard = (props) => {
    const dispatch = useDispatch();
    const onOpen = (data) => {
      dispatch(
        Actions.Cart.selectedEdit(data.menu, data._id, data.quality, data.note)
      );
    };

    const { data } = props;
    return (
      <div
        style={{
          marginTop: "1rem",
          marginBottom: "1rem",
          backgroundColor: "#FFFFFF66",
          borderRadius: 8,
          // height: 100,
          display: "flex",
          justifyItems: "center",
          paddingBottom: "0.25rem",
          paddingTop: "0.25rem",
          paddingLeft: "0.25rem",
          paddingRight: "0.25rem",
        }}
      >
        <div
          style={{
            width: "20%",
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#FFBC03",
              width: 35,
              height: 35,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography style={{ color: "#FFFFFF" }} align="center">
              {`${data.quality || 0}x`}
            </Typography>
          </div>

          <Button
            style={{
              marginTop: "0.5rem",
              minWidth: 0,
              padding: 0,
              width: 40,
              height: 40,
            }}
            onClick={() => onOpen(data)}
          >
            <Typography
              variant="h6"
              style={{ color: "#CF672E" }}
              align="center"
            >
              Edit
            </Typography>
          </Button>
        </div>
        <div
          style={{
            width: "80%",
            textAlign: "right",
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
            position: "relative",
          }}
        >
          <Typography variant="h6" style={{ color: "#00000" }}>
            {`${data.menu.name || "name"}`}
          </Typography>
          {data.note ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Typography style={{ color: "#AEA2A2" }}>Note</Typography>
              <Typography style={{ color: "#000000", marginLeft: "1rem" }}>
                {`${data.note}`}
              </Typography>
            </div>
          ) : (
            <div />
          )}
          {data.menu.promo ? (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Typography style={{ color: "#1FA845" }}>Promo</Typography>
              <Typography
                style={{
                  color: "#000000",
                  marginLeft: "1rem",
                  textDecorationLine: "line-through",
                }}
              >
                {`${convert.Rp(data.total_promo)}`}
              </Typography>
            </div>
          ) : (
            <div />
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Typography style={{ color: "#AEA2A2" }}>Total</Typography>
            <Typography style={{ color: "#000000", marginLeft: "1rem" }}>
              {`${convert.Rp(data.total_price) || convert.Rp(0)}`}
            </Typography>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {Cart.data.map((e, i) => {
        return <ItemCard key={i} data={e} />;
      })}
    </>
  );
};

export default ListItemVertical;
