import type { ComponentProps } from "react";
import { CircularProgress } from "@material-ui/core";

type LoadingCustomProps = ComponentProps<typeof CircularProgress>;

const LoadingCustom = (props: LoadingCustomProps) => {
  return <CircularProgress {...props} color="primary" size="1.4rem" />;
};

export default LoadingCustom;
