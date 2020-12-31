/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import OrderDialog from "./order.dialog";
// import StarIcon from "@material-ui/icons/Star";

const ListCardVertical = ({ data = [] }) => {
  const [isDialog, setIsDialog] = React.useState(false);
  const [selected, setSelected] = React.useState({});
  const { width } = useWindowDimensions();
  const onPress = (e) => {
    setSelected(e);
    setIsDialog(true);
  };

  function convertPrice(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const margin = width * 0.025;
  return (
    <div style={{ margin: margin / 2 }}>
      <Grid container>
        {data.map((e) => {
          return (
            <Grid key={`${e.name}`} item xs={6} sm={4}>
              <buttom onClick={() => onPress(e)}>
                <div
                  style={{
                    margin: margin / 2,
                    padding: margin / 2,
                    backgroundColor: "#FFFFFF9E",
                    borderRadius: 9,
                    height: 254,
                    position: "relative",
                  }}
                >
                  <div
                    alt={e.name}
                    style={{
                      borderRadius: 8,
                      width: "100%",
                      height: 166,
                      backgroundImage: `url(${e.image})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                    }}
                  >
                    {e.promo > 0 ? (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -17,
                          right: 0,
                          alignContent: "center",
                        }}
                      >
                        <img src={`/assets/icons/star.png`} alt={e.name} />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                  <div>
                    <Typography style={{ color: "#000000" }}>
                      {`${e.name}`}
                    </Typography>
                  </div>
                  <div>
                    <Typography style={{ color: "#000000" }}>
                      {`${e.desc}`}
                    </Typography>
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 4,
                      right: 4,
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      {e.promo > 0 ? (
                        <div
                          style={{
                            width: "40%",
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          <Typography
                            style={{
                              color: "#37929E",
                              textDecorationLine: "line-through",
                            }}
                            align="left"
                            variant="h5"
                          >
                            {convertPrice(e.price)}
                          </Typography>
                          <Typography
                            style={{ color: "#408A1D" }}
                            align="left"
                            variant="h5"
                          >
                            {convertPrice(e.price - e.promo)}
                          </Typography>
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "40%",
                          }}
                        >
                          <Typography
                            style={{
                              color: "#37929E",
                            }}
                            align="left"
                            variant="h5"
                          >
                            {convertPrice(e.price)}
                          </Typography>
                        </div>
                      )}

                      {/* <div style={{ width: "60%" }}>
                        {e.promo > 0 ? (
                          <Typography
                            style={{ color: "#408A1D" }}
                            align="right"
                            variant="h5"
                          >
                            {`Promo ${convertPrice(e.promo)}`}
                          </Typography>
                        ) : (
                          <div />
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </buttom>
            </Grid>
          );
        })}
      </Grid>
      <OrderDialog
        data={selected}
        open={isDialog}
        onClose={() => setIsDialog(false)}
      />
    </div>
  );
};

export default ListCardVertical;
