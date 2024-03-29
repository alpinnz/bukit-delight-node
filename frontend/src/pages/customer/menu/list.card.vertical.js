/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Grid, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Actions from "./../../../actions";
import Icons from "./../../../assets/icons";
import convert from "./../../../helpers/convert";

const ListCardVertical = ({ data = [] }) => {
  // const Cart = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const onPress = (menu) => {
    dispatch(Actions.Cart.selectedAdd(menu));
    dispatch(Actions.Cart.dialogMenuOpen());
  };

  return (
    <div style={{ margin: "0.25rem" }}>
      <Grid container>
        {data.map((e) => {
          return (
            <Grid key={`${e.name}`} item xs={6} sm={4}>
              <buttom onClick={() => onPress(e)}>
                <div
                  style={{
                    margin: "0.25rem",
                    padding: "0.50rem",
                    backgroundColor: "#FFFFFF9E",
                    borderRadius: 9,
                    height: 259,
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
                    {e.favorite > 0 ? (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -17,
                          right: 0,
                          alignContent: "center",
                        }}
                      >
                        <img src={Icons.star} alt={e.name} />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  <div style={{ padding: "0.25rem" }}>
                    <div>
                      <Typography style={{ color: "#000000" }}>
                        {`${e.name}`}
                      </Typography>
                    </div>
                    {/* <div>
                      <Typography style={{ color: "#000000" }}>
                        {`${e.desc}`}
                      </Typography>
                    </div> */}

                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingLeft: "0.5rem",
                        paddingRight: "0.5rem",
                        paddingBottom: "0.25rem",
                      }}
                    >
                      <div style={{ display: "flex" }}>
                        {e.promo > 0 ? (
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <Typography
                              style={{
                                color: "#37929E",
                                textDecorationLine: "line-through",
                                marginRight: "0.5rem",
                              }}
                              align="left"
                              variant="h5"
                            >
                              {convert.Price(e.price)}
                            </Typography>
                            <Typography
                              style={{ color: "#408A1D" }}
                              align="left"
                              variant="h5"
                            >
                              {convert.Price(e.price - e.promo)}
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
                              {convert.Price(e.price)}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </buttom>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default ListCardVertical;
