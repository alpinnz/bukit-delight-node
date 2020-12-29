/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import ContainerBase from "./../components/container.base";
import useWindowDimensions from "./../components/hooks/useWindowDimensions";
import Actions from "./../redux/actions";
import Axios from "./../helpers/axios";
import convertPrice from "./../helpers/convertPrice";
import { Typography, Grid, Button } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import PaymentDialog from "./../components/customer/cart/payment.dialog.js";
import EditDialog from "./../components/customer/cart/edit.dialog.js";

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

const ItemCart = ({ data }) => {
  const { width } = useWindowDimensions();

  const margin = width * 0.025;
  const [isEdit, setIsEdit] = React.useState(false);

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
      <div style={{ width: "20%", paddingLeft: margin, paddingRight: margin }}>
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
          onClick={() => setIsEdit(true)}
        >
          <Typography variant="h6" style={{ color: "#CF672E" }} align="center">
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
      <EditDialog data={data} open={isEdit} onClose={() => setIsEdit(false)} />
    </div>
  );
};

const CardView = () => {
  const Cart = useSelector((state) => state.Cart);
  const Menus = useSelector((state) => state.Menus);
  const [data, setData] = React.useState([]);
  const [isDialog, setIsDialog] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();

  const { width } = useWindowDimensions();

  const margin = width * 0.025;

  React.useEffect(() => {
    LOAD_API_GET();
  }, []);

  React.useEffect(() => {
    if (Cart && Menus) {
      if (Cart.data.length > 0 && Menus.data.length > 0) {
        GET_CART_MENU();
      }
    }
  }, [Cart]);

  const GET_CART_MENU = async () => {
    setIsLoading(true);
    let temp = [];

    Cart.data.forEach((e) => {
      console.log(e);
      let result = Menus.data.find((item) => item._id === e.id_menu);
      result["_id"] = e._id;
      result["id_menu"] = e.id_menu;
      result["note"] = e.note;

      let qty = Number(e.qty);
      let total = Number(e.qty) * Number(result.price);

      if (result.promo) {
        let promo = Number(result.promo);
        let after_promo = total - promo;
        result["qty"] = qty;
        result["promo"] = promo;
        result["total"] = after_promo;
      } else {
        result["qty"] = qty;
        result["total"] = total;
      }

      if (result) {
        temp.push(result);
      }
    });
    setData(temp);
    setIsLoading(false);
  };

  const LOAD_API_GET = () => {
    Axios.get("api/v1/menus")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Menus.UPDATE(data));
      })
      .catch((err) => {
        dispatch(Actions.Services.popupNotification(`Menus :${err}`));
        console.log(err);
      });
  };

  if (isLoading) {
    return <div />;
  }

  return (
    <ContainerBase navigationActive={0}>
      <div style={{ marginLeft: margin, marginRight: margin }}>
        <Overview />
        <Typography
          style={{ color: "#D95C17", margin: "1rem" }}
          variant="h6"
          align="center"
        >
          Sudah siap pesan ?
        </Typography>

        {data.map((e, i) => {
          return <ItemCart key={i} data={e} />;
        })}
        {data.length > 0 ? <Recipe data={data} /> : <div />}

        {data.length > 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          >
            <Button
              style={{
                paddingLeft: 125,
                paddingRight: 125,
                borderRadius: 9,
                backgroundColor: "#A42121",
                color: "#FFFFFF",
              }}
              variant="contained"
              onClick={() => setIsDialog(true)}
            >
              <Typography style={{ color: "#FFFFFF" }}>Pesan</Typography>
            </Button>
          </div>
        ) : (
          <div />
        )}
      </div>

      <PaymentDialog open={isDialog} onClose={() => setIsDialog(false)} />
    </ContainerBase>
  );
};

export default CardView;
