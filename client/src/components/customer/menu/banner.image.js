import * as React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const BannerImage = ({ image }) => {
  return (
    <div
      style={{
        height: 104,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {image ? (
        <img
          style={{
            marginLeft: "2.5%",
            marginRight: "2.5%",
            borderRadius: 8,
            width: "95%",
            height: 104,
          }}
          src={`${image}`}
          alt={"banner-menu"}
        />
      ) : (
        <CircularProgress style={{ color: "#CF672E" }} />
      )}
    </div>
  );
};

export default BannerImage;
