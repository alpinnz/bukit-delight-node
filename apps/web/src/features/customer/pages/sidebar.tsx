import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingCustom from "../../../components/common/loading.custom";

type Category = { _id: string; name: string };
type CustomerSidebarState = {
  Categories: { loading: boolean; data: Category[] };
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

const CustomerCategoryNavigation = () => {
  const { _id: selectedCategoryId } = useParams<{ _id?: string }>();
  const classes = useStyles();
  const categories = useSelector(
    (state: CustomerSidebarState) => state.Categories,
  );

  if (categories.loading) {
    return (
      <div
        style={{
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingCustom />
      </div>
    );
  }

  const isHome = window.location.pathname === "/customer/home";

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="Kategori menu customer">
        <Divider />
        {categories.data.map((category) => {
          const isSelected = category._id === selectedCategoryId;

          return (
            <div key={category._id}>
              <ListItem
                button
                component={Link}
                selected={isSelected}
                style={{
                  backgroundColor: isSelected ? "#FFA472" : "transparent",
                }}
                to={`/customer/book/${category._id}`}
              >
                <ListItemText
                  style={{
                    color: isSelected ? "#FFFFFF" : "#000000",
                    opacity: isSelected ? 1 : 0.5,
                    fontWeight: "bold",
                  }}
                  primary={category.name}
                />
              </ListItem>
              <Divider />
            </div>
          );
        })}
        <ListItem
          button
          selected={isHome}
          component={Link}
          to="/customer/home"
          style={{
            backgroundColor: isHome ? "#FFA472" : "transparent",
          }}
        >
          <ListItemText
            style={{ color: isHome ? "#FFFFFF" : "#FF0B63" }}
            primary="PROMO & FAV."
          />
        </ListItem>
        <Divider />
      </List>
    </div>
  );
};

const CustomerSidebar = () => (
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
        height: "10vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        style={{ color: "#11613F", fontWeight: "bolder" }}
        align="center"
        variant="h5"
      >
        LOGO &amp; TEKS BUKIT DELIGHT
      </Typography>
    </div>
    <CustomerCategoryNavigation />
  </div>
);

export default CustomerSidebar;
