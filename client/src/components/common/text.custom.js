import { Typography } from "@material-ui/core";

const TextCustom = ({ children, ...props }) => {
  return <Typography {...props}>{children || "label"}</Typography>;
};

export default TextCustom;
