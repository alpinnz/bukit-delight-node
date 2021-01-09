/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Typography, Grid } from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import Icons from "./../../../assets/icons";
import Actions from "./../../../actions";
import LoadingCustom from "./../../../components/common/loading.custom";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

const ListProducts = () => {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const Menus = useSelector((state) => state.Menus);
  const Cart = useSelector((state) => state.Cart);
  const selected = Cart.selected.menu;
  // const Menus = useSelector((state) =>
  //   state.Menus.data.filter((e) => e.id_category._id === _id)
  // );

  const [state, setState] = useState([[]]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    convert2D();
    return () => {
      setState([[]]);
    };
  }, [Menus, _id]);

  const convert2D = async () => {
    let index = 0;
    let temp = [[]];

    const data = await Menus.data.filter((e) => e.id_category._id === _id);

    for (let i = 0; i < data.length; i++) {
      console.log(i % 4);
      if (i % 5 === 0 && i !== 0) {
        temp.push([]);
        index++;
        temp[index].push(data[i]);
      } else {
        temp[index].push(data[i]);
      }
    }

    console.log("temp", temp);

    setState(temp);
  };

  const onPress = (menu) => {
    // alert(menu["name"]);
    dispatch(Actions.Cart.selectedAdd(menu));
  };

  const handleChange = (event, value) => {
    if (page.length > 1) {
      setPage(value);
    }
  };

  if (Menus.loading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCustom />
      </div>
    );
  }
  return (
    <div style={{ height: "80vh" }}>
      <Grid
        container
        spacing={0}
        style={{
          paddingTop: "1vh",
          paddingLeft: "1vw",
          paddingRight: "1vw",
          paddingBottom: "1vh",
          height: "70vh",
        }}
      >
        {state[page].map((e, i) => {
          return (
            <Grid key={i} item md={4} lg={4} xl={4}>
              <bottom onClick={() => onPress(e)}>
                <div
                  style={{
                    marginBottom: "1vh",
                    marginTop: "1vh",
                    marginLeft: "1vw",
                    marginRight: "1vw",
                    padding: "1rem",
                    backgroundColor: selected
                      ? selected["_id"] === e["_id"]
                        ? "#CF672E"
                        : "#FFBA94"
                      : "#FFBA94",
                    boxShadow:
                      "-4px -4px 6px rgba(255, 255, 255, 0.04), 4px 4px 7px rgba(0, 0, 0, 0.05",
                    borderRadius: 20,
                    height: "30vh",
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
                        <img src={Icons.star} alt={e.name} />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: "0.25rem",
                    }}
                  >
                    <div>
                      <Typography
                        // variant="h6"
                        align="center"
                        style={{
                          color: selected
                            ? selected["_id"] === e["_id"]
                              ? "#FFFFFF"
                              : "#000000"
                            : "#000000",
                        }}
                      >
                        {`${e.name}`}
                      </Typography>
                    </div>
                  </div>
                </div>
              </bottom>
            </Grid>
          );
        })}
      </Grid>
      <div
        style={{
          height: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={page.length}
          page={page}
          onChange={handleChange}
          disabled={page.length > 1 ? true : false}
        />
      </div>
    </div>
  );
};

const ListFavorit = () => {
  const dispatch = useDispatch();
  const Menus = useSelector((state) => state.Menus);
  const Cart = useSelector((state) => state.Cart);
  const selected = Cart.selected.menu;

  function convertPrice(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  const [state, setState] = useState([[]]);
  const [page, setPage] = useState(0);

  useEffect(() => {
    convert2D();
    return () => {
      setState([[]]);
    };
  }, [Menus]);

  const convert2D = async () => {
    let index = 0;
    let temp = [[]];

    const data = await Menus.data;

    for (let i = 0; i < data.length; i++) {
      if (i % 5 === 0 && i !== 0) {
        temp.push([]);
        index++;
        temp[index].push(data[i]);
      } else {
        temp[index].push(data[i]);
      }
    }

    console.log("temp", temp);

    setState(temp);
  };

  const onPress = (menu) => {
    // alert(menu["name"]);
    dispatch(Actions.Cart.selectedAdd(menu));
  };

  const handleChange = (event, value) => {
    if (page.length > 1) {
      setPage(value);
    }
  };

  if (Menus.loading) {
    return (
      <div
        style={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCustom />
      </div>
    );
  }
  return (
    <div style={{ height: "80vh" }}>
      <Grid
        container
        spacing={0}
        style={{
          paddingTop: "1vh",
          paddingLeft: "1vw",
          paddingRight: "1vw",
          paddingBottom: "1vh",
          height: "70vh",
        }}
      >
        {state[page].map((e, i) => {
          return (
            <Grid key={i} item md={4} lg={4} xl={4}>
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
                    height: "35vh",
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
                    <div>
                      <Typography style={{ color: "#000000" }}>
                        {`${e.desc}`}
                      </Typography>
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        paddingLeft: "0.5rem",
                        paddingRight: "0.5rem",
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
                      </div>
                    </div>
                  </div>
                </div>
              </bottom>
            </Grid>
          );
        })}
      </Grid>
      <div
        style={{
          height: "10vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={page.length}
          page={page}
          onChange={handleChange}
          disabled={page.length > 1 ? true : false}
        />
      </div>
    </div>
  );
};

const ContentLeft = () => {
  return (
    <div
      style={{
        height: "80vh",
        position: "relative",
        backgroundColor: "#FFA472",
      }}
    >
      {window.location.pathname === "/customer/home" ? (
        <ListFavorit />
      ) : (
        <ListProducts />
      )}
    </div>
  );
};

export default ContentLeft;
