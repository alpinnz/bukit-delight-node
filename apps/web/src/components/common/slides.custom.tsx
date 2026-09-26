import type { CSSProperties } from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

type SlideCustomProps = {
  data?: string[];
  height?: CSSProperties["height"];
};

const SlideCustom = ({ data = [], height }: SlideCustomProps) => {
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
        {data.map((image, index) => (
          <div key={index} style={{ width: "100%" }}>
            <img
              style={{ height: height || 173, borderRadius: 8, width: "100%" }}
              src={image}
              alt={`${index}`}
            />
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default SlideCustom;
