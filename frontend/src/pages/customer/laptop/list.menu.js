import React from "react";
import { Typography, Grid } from "@material-ui/core";
import Icons from "./../../../assets/icons";
import convert from "./../../../helpers/convert";
import { useSelector, useDispatch } from "react-redux";
import Actions from "./../../../actions";

const ListMenu = (props) => {
  const { data = [] } = props;
  const dispatch = useDispatch();
  const Cart = useSelector((state) => state.Cart);
  const selected = Cart.selected.menu;

  const onPress = (menu) => {
    dispatch(Actions.Cart.selectedAdd(menu));
  };
  return (
    <Grid
      container
      spacing={0}
      style={{
        paddingTop: "0.5vh",
        paddingLeft: "0.5vw",
        paddingRight: "0.5vw",
        paddingBottom: "0.5vh",
        height: "75vh",
      }}
    >
      {data.map((e, i) => {
        return (
          <Grid key={i} item md={4} lg={4} xl={4} spacing={0}>
            <bottom onClick={() => onPress(e)}>
              <div
                style={{
                  marginBottom: "0.5vh",
                  marginTop: "0.5vh",
                  marginLeft: "0.5vw",
                  marginRight: "0.5vw",
                  padding: "0.5rem",
                  backgroundColor: selected
                    ? selected["_id"] === e["_id"]
                      ? "#CF672E"
                      : "#FFBA94"
                    : "#FFBA94",
                  boxShadow:
                    "-4px -4px 6px rgba(255, 255, 255, 0.04), 4px 4px 7px rgba(0, 0, 0, 0.05",
                  borderRadius: 20,
                  height: "35.5vh",
                  position: "relative",
                }}
              >
                <div
                  alt={e.name}
                  style={{
                    borderRadius: 15,
                    width: "100%",
                    height: "22vh",

                    backgroundImage: `url(${e.image})`,
                    backgroundPosition: "50% 50%",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                  }}
                >
                  {e.favorite && (
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
                      paddingBottom: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      {e.promo > 0 ? (
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            style={{
                              color: "#37929E",
                              textDecorationLine: "line-through",
                              marginRight: "1rem",
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
            </bottom>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default ListMenu;
