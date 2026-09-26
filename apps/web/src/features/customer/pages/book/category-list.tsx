import { Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

type CustomerCategory = { _id: string; name: string; image?: string };
type CustomerBookState = { Categories: { data: CustomerCategory[] } };

const CATEGORY_COLORS = [
  "#BCB686B8",
  "#AA2222A3",
  "#C8540059",
  "#CAC43566",
  "#7CAF4E80",
  "#BCB686B8",
];

const CustomerCategoryList = () => {
  const categories = useSelector(
    (state: CustomerBookState) => state.Categories.data,
  );

  if (categories.length === 0) return null;

  return (
    <div style={{ marginLeft: "0.25rem", marginRight: "0.25rem" }}>
      <Grid container spacing={0}>
        {categories.map((category, index) => (
          <Grid key={category._id} item xs={6} sm={4}>
            <div
              style={{
                marginLeft: "0.25rem",
                marginRight: "0.25rem",
                marginBottom: "0.5rem",
              }}
            >
              <Link
                aria-label={`Pilih kategori ${category.name}`}
                to={`/customer/book/${category._id}`}
              >
                <div
                  role={category.image ? "img" : undefined}
                  aria-label={category.image ? category.name : undefined}
                  style={{
                    backgroundImage: category.image
                      ? `url(${category.image})`
                      : undefined,
                    backgroundColor: "#BCB686B8",
                    backgroundPosition: "50% 50%",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    position: "relative",
                    width: "100%",
                    borderRadius: 9,
                    height: 200,
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      backgroundColor:
                        CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                      bottom: 0,
                      right: 0,
                      left: 0,
                      borderBottomLeftRadius: 9,
                      borderBottomRightRadius: 9,
                      borderTopRightRadius: 1,
                      borderTopLeftRadius: 1,
                      height: "2.5rem",
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                    }}
                  >
                    <Typography style={{ color: "#FFFFFF" }} align="center">
                      {category.name}
                    </Typography>
                  </div>
                </div>
              </Link>
            </div>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CustomerCategoryList;
