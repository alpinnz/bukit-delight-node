/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import convertPrice from "./../../../helpers/convertPrice";
import { Typography, Button } from "@material-ui/core";
import EditDialog from "./../../customer/cart/edit.dialog.js";
import { useSelector } from "react-redux";

const ListItemVertical = () => {
  const { width } = useWindowDimensions();

  const [isEdit, setIsEdit] = React.useState(false);

  const Cart = useSelector((state) => state.Cart);
  const Menus = useSelector((state) => state.Menus);
  const [state, setState] = React.useState([]);

  const margin = width * 0.025;

  React.useEffect(() => {
    if (Cart && Menus) {
      if (Cart.data.length > 0 && Menus.data.length > 0) {
        GET_CART_MENU();
      }
    }
  }, [Cart, Menus]);

  const GET_CART_MENU = async () => {
    let temp = [];

    Cart.data.forEach(async (e) => {
      if (e._id && e.id_menu) {
        let product = await Menus.data.find(
          (item) => `${item._id}`.toString() === `${e.id_menu}`.toString()
        );

        product["_id"] = `${e._id}`.toString();
        product["id_menu"] = `${e.id_menu}`.toString();
        product["note"] = e.note || "";

        let qty = Number(e.qty);
        let total = Number(e.qty) * Number(product.price);

        if (product.promo) {
          let promo = Number(product.promo);
          let total_promo = promo * qty;
          let after_promo = total - total_promo;
          product["qty"] = qty;
          product["promo"] = promo;
          product["total"] = after_promo;
        } else {
          product["qty"] = qty;
          product["total"] = total;
        }
        temp.push(product);
      }
    });

    setState(temp);
  };

  const ItemCard = ({ data }) => {
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
          paddingBottom: margin,
          paddingTop: margin,
          paddingLeft: margin,
          paddingRight: margin,
        }}
      >
        <div
          style={{ width: "20%", paddingLeft: margin, paddingRight: margin }}
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
              {`${data.qty || 0}x`}
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
            // onClick={() => setIsEdit(true)}
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
            paddingLeft: margin,
            paddingRight: margin,
            position: "relative",
          }}
        >
          <Typography variant="h6" style={{ color: "#00000" }}>
            {`${data.name || "name"}`}
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
          {data.promo ? (
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
                {`${convertPrice(data.promo)}`}
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
              {`${convertPrice(data.total) || convertPrice(0)}`}
            </Typography>
          </div>
        </div>
        <EditDialog
          data={data}
          open={isEdit}
          // onClose={() => setIsEdit(false)}
        />
      </div>
    );
  };

  return (
    <>
      {state.map((e, i) => {
        console.log(e);
        return <ItemCard key={i} data={e} />;
      })}
    </>
  );
};

export default ListItemVertical;
