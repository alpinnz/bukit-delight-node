import React from "react";
import { Dialog, Slide, Typography } from "@material-ui/core";
import useWindowDimensions from "./../../hooks/useWindowDimensions";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const PaymentDialog = ({ open, onClose }) => {
  const { width } = useWindowDimensions();

  const margin = width * 0.015;
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <div
          style={{
            // width: 320,
            borderRadius: 10,
            backgroundColor: "#FFFFFF",
            padding: margin,
          }}
        >
          <Typography
            style={{
              color: "#000000",
              paddingTop: margin,
              paddingBottom: margin,
            }}
            variant="h6"
            align="center"
          >
            Pilih Metode Pembayaran
          </Typography>

          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              padding: margin,
            }}
          >
            <div
              style={{
                backgroundColor: "#D6A4A4",
                width: "45%",
                height: 173,
                borderRadius: 13,
                padding: margin,
              }}
            >
              <div
                style={{
                  backgroundColor: "#D6A4A4",
                  height: "70%",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <img
                  style={{ width: "70%", height: "70%" }}
                  src="/assets/icons/cashier.png"
                  alt="cashier"
                />
              </div>
              <div
                style={{
                  backgroundColor: "#D6A4A4",
                  height: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Typography
                  style={{
                    color: "#000000",
                    paddingTop: margin * 0.2,
                    paddingBottom: margin * 0.2,
                  }}
                  variant="h6"
                  align="center"
                >
                  Tunai
                </Typography>
              </div>
            </div>
            <div
              style={{
                backgroundColor: "#D6A4A4",
                width: "45%",
                height: 173,
                borderRadius: 13,
                padding: margin,
              }}
            >
              <div
                style={{
                  backgroundColor: "#D6A4A4",
                  height: "70%",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <img
                  style={{ width: "70%", height: "70%" }}
                  src="/assets/icons/e money.png"
                  alt="e money"
                />
              </div>
              <div
                style={{
                  backgroundColor: "#D6A4A4",
                  height: "30%",
                  alignItems: "center",
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Typography
                  style={{
                    color: "#000000",

                    paddingTop: margin * 0.2,
                    paddingBottom: margin * 0.2,
                  }}
                  variant="h6"
                  align="center"
                >
                  E-Money
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default PaymentDialog;
