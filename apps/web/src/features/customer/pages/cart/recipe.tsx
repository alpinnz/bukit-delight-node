import { Typography } from "@material-ui/core";
import { useSelector } from "react-redux";

type CartLine = {
  total_promo?: number | string;
  total_price?: number | string;
};
type CustomerCartState = { Cart: { data: CartLine[] } };

const CustomerCartRecipe = () => {
  const lines = useSelector((state: CustomerCartState) => state.Cart.data);
  const promo = lines.reduce(
    (total, line) => total + Number(line.total_promo ?? 0),
    0,
  );
  const total = lines.reduce(
    (amount, line) => amount + Number(line.total_price ?? 0),
    0,
  );

  return (
    <div
      style={{
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
        backgroundColor: "#FFFFFF66",
        borderRadius: 8,
        justifyItems: "center",
        padding: "0.25rem",
      }}
    >
      {promo > 0 && (
        <>
          <div style={{ display: "flex", width: "100%", padding: "0 0.25rem" }}>
            <div style={{ width: "40%", textAlign: "left" }}>
              <Typography style={{ color: "#000000" }} align="left">
                Harga Awal
              </Typography>
            </div>
            <div style={{ width: "60%", textAlign: "right" }}>
              <Typography
                variant="h6"
                style={{ color: "#000000", textDecorationLine: "line-through" }}
                align="right"
              >
                {promo + total}
              </Typography>
            </div>
          </div>
          <div style={{ display: "flex", width: "100%", padding: "0 0.25rem" }}>
            <div style={{ width: "30%", textAlign: "left" }}>
              <Typography style={{ color: "#1FA845" }} align="left">
                Promo
              </Typography>
            </div>
            <div style={{ width: "70%", textAlign: "right" }}>
              <Typography style={{ color: "#1FA845" }} align="right">
                {promo}
              </Typography>
            </div>
          </div>
        </>
      )}
      <div style={{ display: "flex", width: "100%", padding: "0 0.25rem" }}>
        <div style={{ width: "30%", textAlign: "left" }}>
          <Typography style={{ color: "#000000" }} align="left">
            Total
          </Typography>
        </div>
        <div style={{ width: "70%", textAlign: "right" }}>
          <Typography variant="h4" style={{ color: "#000000" }} align="right">
            {total}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default CustomerCartRecipe;
