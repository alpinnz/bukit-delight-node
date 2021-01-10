import { Button, makeStyles } from "@material-ui/core";
import LoadingCustom from "./loading.custom";
import TextCustom from "./text.custom";

const useStyles = makeStyles((theme) => ({
  submit: {
    margin: theme.spacing(3, 0, 2),
    height: theme.spacing(4.5),
  },
}));

const ButtonCustom = ({
  style,
  loading,
  disabled,
  onClick,
  label,
  fullWidth,
}) => {
  const classes = useStyles();
  return (
    <Button
      fullWidth={fullWidth || false}
      variant="contained"
      color="primary"
      disabled={disabled || false}
      className={classes.submit}
      onClick={onClick}
      style={style}
    >
      {loading ? (
        <LoadingCustom />
      ) : (
        <TextCustom>{label || "label"}</TextCustom>
      )}
    </Button>
  );
};

export default ButtonCustom;
