import { useEffect, useState } from "react";
import { ButtonBase, Grid, Typography } from "@material-ui/core";
import Pagination from "@material-ui/lab/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Actions from "../../../actions";
import Icons from "../../../assets/icons";
import LoadingCustom from "../../../components/common/loading.custom";
import Convert from "../../../helpers/convert";

type DesktopMenu = {
  _id: string;
  name: string;
  image: string;
  price: number;
  promo: number;
  favorite?: boolean | number;
  id_category: { _id: string };
};
type CustomerDesktopMenuState = {
  Menus: { loading: boolean; data: DesktopMenu[] };
  Cart: { selected: { menu: DesktopMenu } };
};

const MENUS_PER_PAGE = 6;

const DesktopMenuList = ({ menus }: { menus: DesktopMenu[] }) => {
  const dispatch = useDispatch();
  const selectedMenu = useSelector(
    (state: CustomerDesktopMenuState) => state.Cart.selected.menu,
  );

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
      {menus.map((menu) => {
        const isSelected = selectedMenu?._id === menu._id;

        return (
          <Grid key={menu._id} item md={4} lg={4} xl={4} spacing={0}>
            <ButtonBase
              type="button"
              aria-label={`Pilih ${menu.name}`}
              onClick={() => dispatch(Actions.Cart.selectedAdd(menu))}
              style={{ width: "100%", textAlign: "left" }}
            >
              <div
                style={{
                  margin: "0.5vh 0.5vw",
                  padding: "0.5rem",
                  backgroundColor: isSelected ? "#CF672E" : "#FFBA94",
                  boxShadow:
                    "-4px -4px 6px rgba(255, 255, 255, 0.04), 4px 4px 7px rgba(0, 0, 0, 0.05)",
                  borderRadius: 20,
                  height: "35.5vh",
                  position: "relative",
                  width: "100%",
                }}
              >
                <div
                  role="img"
                  aria-label={menu.name}
                  style={{
                    borderRadius: 15,
                    width: "100%",
                    height: "22vh",
                    backgroundImage: `url(${menu.image})`,
                    backgroundPosition: "50% 50%",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                  }}
                >
                  {menu.favorite ? (
                    <div
                      style={{
                        position: "absolute",
                        bottom: -17,
                        right: 0,
                        alignContent: "center",
                      }}
                    >
                      <img src={Icons.star} alt="Favorit" />
                    </div>
                  ) : null}
                </div>
                <div style={{ padding: "0.25rem" }}>
                  <Typography style={{ color: "#000000" }}>
                    {menu.name}
                  </Typography>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "0 0.5rem 0.5rem",
                    }}
                  >
                    <div style={{ display: "flex" }}>
                      {menu.promo > 0 ? (
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            style={{
                              color: "#37929E",
                              textDecorationLine: "line-through",
                              marginRight: "1rem",
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
                        <Typography
                          style={{ color: "#37929E", width: "40%" }}
                          align="left"
                          variant="h5"
                        >
                          {Convert.Price(menu.price)}
                        </Typography>
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
  );
};

const CustomerDesktopMenuPanel = () => {
  const { _id: categoryId } = useParams<{ _id?: string }>();
  const { pathname } = useLocation();
  const isHomePage = pathname === "/customer/home";
  const menusState = useSelector(
    (state: CustomerDesktopMenuState) => state.Menus,
  );
  const [page, setPage] = useState(1);
  const filteredMenus = menusState.data.filter((menu) =>
    isHomePage
      ? menu.promo > 0 || Boolean(menu.favorite)
      : menu.id_category?._id === categoryId,
  );
  const pageCount = Math.max(
    1,
    Math.ceil(filteredMenus.length / MENUS_PER_PAGE),
  );
  const pages = Array.from({ length: pageCount }, (_, pageIndex) =>
    filteredMenus.slice(
      pageIndex * MENUS_PER_PAGE,
      (pageIndex + 1) * MENUS_PER_PAGE,
    ),
  );

  useEffect(() => {
    setPage(1);
  }, [categoryId, isHomePage]);

  if (menusState.loading) {
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
    <div style={{ height: "80vh", position: "relative" }}>
      <DesktopMenuList menus={pages[page - 1] ?? []} />
      <div
        style={{
          height: "5vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_event, nextPage) => setPage(nextPage)}
          disabled={pageCount <= 1}
        />
      </div>
    </div>
  );
};

const CustomerDesktopMenuContent = () => (
  <div
    style={{
      height: "80vh",
      position: "relative",
      backgroundColor: "#FFA472",
    }}
  >
    <CustomerDesktopMenuPanel />
  </div>
);

export default CustomerDesktopMenuContent;
