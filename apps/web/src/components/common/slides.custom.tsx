import type { CSSProperties } from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

type SlideCustomProps = {
  data?: string[];
  height?: CSSProperties["height"];
};

const SlideCustom = ({ data = [], height }: SlideCustomProps) => {
  return (
    <div className="flex items-center px-2 pt-2">
      <Fade autoplay arrows={false}>
        {data.map((image, index) => (
          <div key={index} className="w-full">
            <img
              className={`w-full rounded-lg ${height ? "" : "h-[173px]"}`}
              style={height ? { height } : undefined}
              src={image}
              alt={`${index}`}
              loading={index === 0 ? "eager" : "lazy"}
              decoding="async"
            />
          </div>
        ))}
      </Fade>
    </div>
  );
};

export default SlideCustom;
