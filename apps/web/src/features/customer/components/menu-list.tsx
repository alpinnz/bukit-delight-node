/* eslint-disable react-hooks/exhaustive-deps */
import { ButtonBase, Grid, Typography } from "@material-ui/core";
import { useDispatch } from "react-redux";
import Actions from "../../../actions";
import Icons from "../../../assets/icons";
import Convert from "../../../helpers/convert";

type MenuCard = {
  _id?: string;
  name: string;
  image: string;
  price: number;
  promo: number;
  favorite?: number;
};

type MenuListProps = {
  data?: MenuCard[];
};

const MenuList = ({ data = [] }: MenuListProps) => {
  const dispatch = useDispatch();
  const onPress = (menu: MenuCard) => {
    dispatch(Actions.Cart.selectedAdd(menu));
    dispatch(Actions.Cart.dialogMenuOpen());
  };

  return (
    <div style={{ margin: "0.25rem" }}>
      <Grid container>
        {data.map((menu) => {
          return (
            <Grid key={menu._id ?? menu.name} item xs={6} sm={4}>
              <ButtonBase
                type="button"
                aria-label={`Pilih ${menu.name}`}
                onClick={() => onPress(menu)}
                style={{ display: "block", width: "100%", textAlign: "left" }}
              >
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
                    role="img"
                    aria-label={menu.name}
                    style={{
                      borderRadius: 8,
                      width: "100%",
                      height: 166,
                      backgroundImage: `url(${menu.image})`,
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                    }}
                  >
                    {menu.favorite && menu.favorite > 0 ? (
                      <div
                        style={{
                          position: "absolute",
                          bottom: -17,
                          right: 0,
                          alignContent: "center",
                        }}
                      >
                        <img src={Icons.star} alt="" />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>

                  <div style={{ padding: "0.25rem" }}>
                    <div>
                      <Typography style={{ color: "#000000" }}>
                        {menu.name}
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
                        {menu.promo > 0 ? (
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
                              {Convert.Price(menu.price)}
                            </Typography>
                            <Typography
                              style={{ color: "#408A1D" }}
                              align="left"
                              variant="h5"
                            >
                              {Convert.Price(menu.price - menu.promo)}
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
                              {Convert.Price(menu.price)}
                            </Typography>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ButtonBase>
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
};

export default MenuList;
