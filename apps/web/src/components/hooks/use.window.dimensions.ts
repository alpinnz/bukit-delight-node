import { useEffect, useState } from "react";

export type WindowDimensions = {
  width: number | null;
  height: number | null;
};

const getWindowDimensions = (): WindowDimensions => {
  if (typeof window === "undefined") return { width: null, height: null };
  return { width: window.innerWidth, height: window.innerHeight };
};

const useWindowDimensions = (): WindowDimensions => {
  const [windowDimensions, setWindowDimensions] =
    useState<WindowDimensions>(getWindowDimensions);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => setWindowDimensions(getWindowDimensions());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};

export default useWindowDimensions;
