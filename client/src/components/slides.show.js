import * as React from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import useWindowDimensions from "./hooks/useWindowDimensions";

const SlidesShow = ({ data = [] }) => {
  const { width } = useWindowDimensions();
  const margin = width * 0.025;
  return (
    <div
      style={{
        paddingLeft: margin,
        paddingRight: margin,
        paddingTop: margin,
        alignItems: "center",
      }}
    >
      <Fade autoplay arrows={false}>
        {data.map((each, index) => (
          <div key={index} style={{ width: "100%" }}>
            <img
              style={{ height: 173, borderRadius: 8, width: "100%" }}
              src={each}
              alt={"each"}
            />
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default SlidesShow;
