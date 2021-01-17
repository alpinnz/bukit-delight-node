import * as React from "react";
import {
  makeStyles,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
  Button,
  IconButton,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import Icons from "./../../../assets/icons";
import { useDispatch } from "react-redux";
import Actions from "./../../../actions";
import { DriveEtaSharp } from "@material-ui/icons";

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

const ListCardHorizontal = (props) => {
  const { data = [], title } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const onPress = (menu) => {
    dispatch(Actions.Cart.selectedAdd(menu));
    dispatch(Actions.Cart.dialogMenuOpen());
  };

  function convertPrice(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

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
            <GridListTile key={`${title}-${e.name}`}>
              <Link
                // component={Button}
                // type="button"
                // style={{
                //   display: "block",
                //   border: "none",
                //   padding: 0,
                //   position: "relative",
                //   WebkitOverflowScrolling: "touch",
                //   flexWrap: "wrap",
                // }}
                onClick={() => onPress(e)}
              >
                <img
                  style={{
                    borderRadius: 8,
                    width: "100%",
                    height: "62%",
                  }}
                  src={e.image}
                  alt={e.title}
                />
                <GridListTileBar
                  classes={classes}
                  title={e.name || ""}
                  subtitle={
                    <div>
                      <spam
                        variant="subtitle1"
                        style={{
                          color: "gray",
                        }}
                      >
                        {e.desc || ""}
                      </spam>
                      {e.promo > 0 ? (
                        <div style={{ display: "flex" }}>
                          <Typography
                            style={{
                              textDecorationLine: "line-through",
                              color: "#37929E",
                              minWidth: "2.5rem",
                            }}
                          >
                            {convertPrice(e.price) || 0}
                          </Typography>
                          <Typography
                            style={{
                              color: "#37929E",
                            }}
                          >
                            {convertPrice(e.price - e.promo) || 0}
                          </Typography>
                        </div>
                      ) : (
                        <Typography
                          style={{
                            color: "#37929E",
                          }}
                        >
                          {convertPrice(e.price) || 0}
                        </Typography>
                      )}
                    </div>
                  }
                  // actionIcon={}
                />
              </Link>
            </GridListTile>
          ))}
        </GridList>
      </div>
    </div>
  );
};

export default ListCardHorizontal;
