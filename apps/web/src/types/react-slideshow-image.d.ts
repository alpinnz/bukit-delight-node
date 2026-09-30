declare module "react-slideshow-image" {
  import type { ComponentType, ReactNode } from "react";

  export const Fade: ComponentType<{
    autoplay?: boolean;
    arrows?: boolean;
    children?: ReactNode;
  }>;
}
