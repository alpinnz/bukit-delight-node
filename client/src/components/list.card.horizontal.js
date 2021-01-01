import * as React from "react";
import {
  makeStyles,
  GridList,
  GridListTile,
  GridListTileBar,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import useWindowDimensions from "./hooks/useWindowDimensions";

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

const ListCardHorizontal = ({ title, data = [] }) => {
  const classes = useStyles();
  const { width } = useWindowDimensions();
  const margin = width * 0.025;

  function convertPrice(num) {
    return Math.abs(num) > 999
      ? Math.sign(num) * (Math.abs(num) / 1000).toFixed(1) + "k"
      : Math.sign(num) * Math.abs(num);
  }

  return (
    <div
      style={{
        marginLeft: margin,
        marginRight: margin,
      }}
    >
      <div
        style={{
          alignItems: "center",

          display: "flex",
        }}
      >
        <img
          style={{ height: 16, width: 16, marginRight: margin }}
          src={"/assets/icons/recommended.png"}
          alt="recommended"
        />
        <Typography>{`${title}`}</Typography>
      </div>
      <div
        style={{
          paddingTop: margin / 2,

          display: "flex",
          alignItems: "center",
        }}
      >
        <GridList className={classes.gridList} cols={2.5}>
          {data.map((e) => (
            <GridListTile key={`${title}-${e.name}`}>
              <Link to="/book">
                <img
                  style={{
                    borderRadius: 8,
                    width: "100%",
                    height: "62%",
                  }}
                  src={e.img}
                  alt={e.title}
                />
                <GridListTileBar
                  classes={classes}
                  title={e.name || ""}
                  subtitle={e.desc || ""}
                  actionIcon={convertPrice(e.price) || 0}
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
