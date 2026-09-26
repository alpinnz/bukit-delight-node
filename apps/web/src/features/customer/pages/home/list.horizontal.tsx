import Convert from "../../../../helpers/convert";
import {
  makeStyles,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
  ButtonBase,
} from "@material-ui/core";
import Icons from "../../../../assets/icons";
import { useDispatch } from "react-redux";
import Actions from "../../../../actions";

type MenuCard = {
  _id?: string;
  name: string;
  title?: string;
  image: string;
  price: number;
  promo: number;
  [key: string]: unknown;
};

type ListHorizontalProps = {
  data?: MenuCard[];
  title: string;
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "nowrap",
  },
  gridList: {
    flexWrap: "nowrap",
  },

  titlePositionBottom: {
    backgroundColor: "transparent",
  },
  titleWrap: {
    width: "100%",
    height: "100%",
  },
  titleWrapActionPosRight: {
    color: "#408A1D",
  },

  title: {
    color: "#000000",
  },
  subtitle: {
    color: "#000000",
  },
}));

const ListCardHorizontal = ({ data = [], title }: ListHorizontalProps) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const onPress = (menu: MenuCard) => {
    dispatch(Actions.Cart.selectedAdd(menu));
    dispatch(Actions.Cart.dialogMenuOpen());
  };

  return (
    <div
      style={{
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <img
          style={{ height: 16, width: 16, marginRight: "0.25rem" }}
          src={Icons.recommended}
          alt="recommended"
        />
        <Typography>{`${title}`}</Typography>
      </div>
      <div
        style={{
          paddingTop: "0.25rem",
          display: "flex",
          alignItems: "center",
        }}
      >
        <GridList className={classes.gridList} cols={2.5}>
          {data.map((e) => (
            <GridListTile style={{ width: 171 }} key={`${title}-${e.name}`}>
              <ButtonBase
                type="button"
                style={{
                  display: "block",
                  border: "none",
                  padding: 0,
                  position: "relative",
                  width: "100%",
                  textAlign: "left",
                }}
                onClick={() => onPress(e)}
              >
                <img
                  style={{
                    borderRadius: 8,
                    width: "100%",
                    height: "62%",
                    // objectFit: "contain",
                  }}
                  src={e.image}
                  alt={e.title}
                />
                <GridListTileBar
                  classes={classes}
                  title={e.name || ""}
                  subtitle={
                    <div>
                      <br />
                      {/* <spam
                        variant="subtitle1"
                        style={{
                          color: "gray",
                        }}
                      >
                        {e.desc || ""}
                      </spam> */}
                      {e.promo > 0 ? (
                        <div style={{ display: "flex" }}>
                          <Typography
                            style={{
                              textDecorationLine: "line-through",
                              color: "#37929E",
                              marginRight: "0.5rem",
                            }}
                          >
                            {Convert.Price(e.price) || 0}
                          </Typography>
                          <Typography
                            style={{
                              color: "#37929E",
                            }}
                          >
                            {Convert.Price(e.price - e.promo) || 0}
                          </Typography>
                        </div>
                      ) : (
                        <Typography
                          style={{
                            color: "#37929E",
                          }}
                        >
                          {Convert.Price(e.price) || 0}
                        </Typography>
                      )}
                    </div>
                  }
                  // actionIcon={}
                />
              </ButtonBase>
            </GridListTile>
          ))}
        </GridList>
      </div>
    </div>
  );
};

export default ListCardHorizontal;
