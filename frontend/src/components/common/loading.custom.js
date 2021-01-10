import { CircularProgress } from "@material-ui/core";

const LoadingCustom = ({ ...props }) => {
  return <CircularProgress {...props} color="primary" size={"1.4rem"} />;
};

export default LoadingCustom;
