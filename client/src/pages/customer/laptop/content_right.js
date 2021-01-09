import * as React from "react";
import { Typography, IconButton, Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Remove";
import Actions from "./../../../actions";
import { useDispatch, useSelector } from "react-redux";
import ButtonCustom from "./../../../components/common/button.custom";
import Icons from "./../../../assets/icons";
import ListItemVertical from "./../cart/list.item.vertical";
import Recipe from "./../cart/recipe";
import PaymentDialog from "./../cart/payment.dialog";
import Overview from "./../cart/overview";

const Selected = () => {
  const dispatch = useDispatch();
  const Cart = useSelector((state) => state.Cart);

  const quality = Cart.selected.quality;
  const note = Cart.selected.note;
  const menu = Cart.selected.menu;

  function convertPrice(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const onIncrement = () => dispatch(Actions.Cart.selectedIncrementQuality());
  const onDescrement = () => dispatch(Actions.Cart.selectedDescrementQuality());
  const onChange = (e) => dispatch(Actions.Cart.selectedChangeNote(e));

  const onClean = () => dispatch(Actions.Cart.selectedClean());

  const onSubmit = () => {
    if (quality <= 0) {
      if (Cart.selected.id_cart) {
        // Remove
        const id_cart = Cart.selected.id_cart;
        dispatch(Actions.Cart.onDelete(id_cart));
        onClean();
      } else {
        // Cancel
        onClean();
      }
    } else {
      if (Cart.selected.id_cart) {
        // Edit
        const id_cart = Cart.selected.id_cart;
        dispatch(Actions.Cart.onUpdate(menu, id_cart, quality, note));
        onClean();
      } else {
        // Add
        dispatch(Actions.Cart.onCreate(menu, quality, note));
        onClean();
      }
    }
  };

  return (
    <div
      style={{
        height: "90vh",
        position: "relative",
        backgroundColor: "#FFECEC",
        paddingTop: "3vh",
        paddingLeft: "3vw",
        paddingRight: "3vw",
        paddingBottom: "3vh",
      }}
    >
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "5vh",
          alignItems: "center",
        }}
      >
        <div style={{ width: "50%" }}>
          <Typography variant="h4" style={{ color: "#37929E" }}>
            {convertPrice(menu["price"])}
          </Typography>
        </div>

        <div
          style={{
            width: "50%",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <IconButton onClick={onClean}>
            <img style={{ height: "2.5vh" }} src={Icons.close} alt="close" />
          </IconButton>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "5vh",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" style={{ color: "#AD3737" }}>
          {menu["name"] || "Name"}
        </Typography>
      </div>
      <div
        style={{
          width: "100%",
          height: "40vh",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
        }}
      >
        <div
          alt={menu["name"]}
          style={{
            borderRadius: 8,
            width: "100%",
            height: "30vh",

            backgroundImage: `url(${menu["image"]})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        >
          {menu["promo"] > 0 ? (
            <div
              style={{
                position: "absolute",
                bottom: -17,
                right: 0,
                alignContent: "center",
              }}
            >
              <img src={Icons.star} alt={menu["name"]} />
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "10vh",
        }}
      >
        <Typography>{menu["desc"] || "Desc"}</Typography>
      </div>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "20vh",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            width: "70%",
          }}
        >
          <div>
            <input
              placeholder="Klik untuk menambahkan catatan"
              value={note}
              onChange={(e) => onChange(e.target.value)}
              style={{
                borderColor: "transparent",
                backgroundColor: "#ECFDFE",
                height: 35,
                width: "100%",
                border: "none",
                borderRadius: 10,
                boxShadow: "none",
                outline: "none",
                "&:hover": {
                  border: "none",
                  outline: "none",
                },
                "&:focus": {
                  border: "none",
                },
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <IconButton onClick={onIncrement}>
              <AddIcon style={{ color: "#AD3636" }} />
            </IconButton>
            <Typography style={{ color: "#AD3636" }}>{quality}</Typography>
            <IconButton onClick={onDescrement}>
              <RemoveIcon style={{ color: "#AD3636" }} />
            </IconButton>
          </div>

          <div>
            <ButtonCustom
              label={
                quality > 0
                  ? Cart.selected.id_cart
                    ? "Edit"
                    : "Add"
                  : Cart.selected.id_cart
                  ? "Remove"
                  : "Cancel"
              }
              style={{
                borderRadius: 10,
                backgroundColor: "#A42121",
                color: "#FFFFFF",
              }}
              variant="contained"
              disabled={Cart.loading}
              loading={Cart.loading}
              onClick={() => onSubmit()}
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ContentRight = () => {
  const dispatch = useDispatch();
  const Cart = useSelector((state) => state.Cart);

  if (Cart.selected.bool) {
    return <Selected />;
  }

  if (Cart.loading) {
    return <div />;
  }
  return (
    <div
      style={{
        height: "90vh",
        position: "relative",
        backgroundColor: "#FFFFFF",
        overflow: "scroll",
      }}
    >
      <Overview />
      {Cart.data.length > 0 && (
        <>
          <Typography
            style={{ color: "#D95C17", margin: "1rem" }}
            variant="h6"
            align="center"
          >
            Sudah siap pesan ?
          </Typography>
          <ListItemVertical />
          <Recipe />
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
              onClick={() => dispatch(Actions.Cart.dialogPaymentOpen())}
            >
              <Typography style={{ color: "#FFFFFF" }}>Pesan</Typography>
            </Button>
          </div>
        </>
      )}

      <PaymentDialog />
    </div>
  );
};

export default ContentRight;
