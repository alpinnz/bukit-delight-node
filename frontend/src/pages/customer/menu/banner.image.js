import * as React from "react";
import LoadingCustom from "./../../../components/common/loading.custom";

const BannerImage = ({ image }) => {
  return (
    <div
      style={{
        height: 104,
        marginLeft: "0.5rem",
        marginRight: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {image ? (
        <img
          style={{
            borderRadius: 8,
            width: "100%",
            height: 104,
          }}
          src={`${image}`}
          alt={"banner-menu"}
        />
      ) : (
        <LoadingCustom style={{ color: "#CF672E" }} />
      )}
    </div>
  );
};

export default BannerImage;
