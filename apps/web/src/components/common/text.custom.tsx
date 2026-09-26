import type { ComponentProps, ElementType } from "react";
import { Typography } from "@material-ui/core";

type TextCustomProps = ComponentProps<typeof Typography> & {
  component?: ElementType;
};

const TextCustom = ({ children, ...props }: TextCustomProps) => {
  return <Typography {...props}>{children || "label"}</Typography>;
};

export default TextCustom;
