import * as React from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const SlideCustom = (props) => {
  const { data = [], height } = props;
  return (
    <div
      style={{
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        paddingTop: "0.5rem",
        alignItems: "center",
      }}
    >
      <Fade autoplay arrows={false}>
        {data.map((e, i) => (
          <div key={i} style={{ width: "100%" }}>
            <img
              style={{ height: height || 173, borderRadius: 8, width: "100%" }}
              src={e}
              alt={i}
            />
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default SlideCustom;
