import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import LoadingCustom from "./../../../components/common/loading.custom";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  selected: {
    backgroundColor: "#FFA472",
    color: "#FFFFFF",
  },
}));

const ListItemCustom = () => {
  const { _id } = useParams();
  const classes = useStyles();
  const Categories = useSelector((state) => state.Categories);

  if (Categories.loading) {
    return (
      <div
        style={{
          height: "85vh",
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
    <div className={classes.root}>
      <List component="nav" aria-label="secondary mailbox folder">
        <Divider />
        {Categories.data.map((e, i) => {
          return (
            <div key={i}>
              <ListItem
                button
                component={Link}
                selected={e["_id"] === _id}
                style={{
                  backgroundColor: e["_id"] === _id ? "#FFA472" : "transparent",
                }}
                to={`/customer/book/${e["_id"]}`}

                //   onClick={(event) => handleListItemClick(event, 2)}
              >
                <ListItemText
                  style={{
                    color: e["_id"] === _id ? "#FFFFFF" : "#000000",

                    opacity: e["_id"] === _id ? 1 : 0.5,
                    fontWeight: "bold",
                  }}
                  primary={`${e["name"]}`}
                />
              </ListItem>
              <Divider />
            </div>
          );
        })}
        <ListItem
          button
          selected={window.location.pathname === "/customer/home"}
          component={Link}
          to={`/customer/home`}
          style={{
            backgroundColor:
              window.location.pathname === "/customer/home"
                ? "#FFA472"
                : "transparent",
          }}
          //   selected={selectedIndex === 2}
          //   onClick={(event) => handleListItemClick(event, 2)}
        >
          <ListItemText
            style={{
              color:
                window.location.pathname === "/customer/home"
                  ? "#FFFFFF"
                  : "#FF0B63",
            }}
            primary={`PROMO & FAV.`}
          />
        </ListItem>
        <Divider />
      </List>
    </div>
  );
};

const Sidebar = () => {
  return (
    <div
      style={{
        height: "100vh",
        position: "relative",
        backgroundColor: "#FFFFFF",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "15vh",
          justifyContent: "center",
          alignItems: "center",
          //   backgroundColor: "red",
        }}
      >
        <Typography
          style={{ color: "#11613F", fontWeight: "bolder" }}
          align="center"
          variant="h5"
        >
          {"LOGO & TEKS BUKIT DELIGHT"}
        </Typography>
      </div>
      <ListItemCustom />
    </div>
  );
};

export default Sidebar;
