/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Button,
  Grid,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
  Avatar,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  Container,
  makeStyles,
} from "@material-ui/core";
import { useLocation } from "react-router-dom";

import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
import Copyright from "./../../components/layouts/copyright";
import Axios from "./../../helpers/axios";
import History from "./../../helpers/history";
import Actions from "./../../redux/actions";
import { useDispatch, useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const URL_PATH = "api/v1/authentication/login";
export default function LoginView() {
  const Authentication = useSelector((state) => state.Authentication);
  const [isInit, setIsInit] = React.useState(true);
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();

  const [isSubmit, setIsSubmit] = React.useState(false);
  const [state, setState] = React.useState({
    fields: {},
    errors: {},
  });

  React.useEffect(() => {
    setIsInit(true);
    if (Authentication.isLogin) {
      const { from } = location.state || {
        from: { pathname: "/admin/dashboard" },
      };
      History.push(from);
    }
    setTimeout(() => {
      setIsInit(false);
    }, 1500);
    document.title = `${"Login"}`;
  }, [Authentication.isLogin]);

  const _onSubmit = () => {
    if (handleValidation()) {
      setIsSubmit(true);
      onLogin();
    }
  };

  const onLogin = async () => {
    setIsSubmit(true);
    const formData = new FormData();
    formData.append("username", state.fields["username"]);
    formData.append("password", state.fields["password"]);

    await Axios.post(URL_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        const data = response["data"]["data"];
        const { from } = location.state || {
          from: { pathname: "/admin/dashboard" },
        };
        localStorage.setItem("account", JSON.stringify(data));
        dispatch(Actions.Authentication.LOGIN(data));
        History.push(from);
        dispatch(Actions.Services.popupNotification(`Login`));
        setIsSubmit(false);
      })
      .catch((err) => {
        dispatch(
          Actions.Services.popupNotification(
            `Useranme or password is incorrect`
          )
        );
        console.log(err);
        setIsSubmit(false);
      });
  };
  const handleValidation = () => {
    let fields = state.fields;
    let errors = {};
    let formIsValid = true;

    //Name
    if (!fields["username"]) {
      formIsValid = false;
      errors["username"] = "Cannot be empty";
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Cannot be empty";
    }

    setState({ ...state, errors: errors });
    return formIsValid;
  };

  const handleChange = (field, value) => {
    let fields = state.fields;

    fields[field] = value;
    setState({ ...state, fields });
  };

  if (isInit) {
    return <div></div>;
  }

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <AccountCircleOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <div className={classes.form}>
          <FormControl
            error={state.errors["username"] || state.errors["username"] === ""}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <InputLabel htmlFor="label-username">Username</InputLabel>
            <OutlinedInput
              id="username"
              value={state.fields["username"] || ""}
              onChange={(e) => handleChange("username", e.target.value)}
              label="Username"
              fullWidth
              required
            />
            <FormHelperText id="help-username">
              {state.errors["username"] || ""}
            </FormHelperText>
          </FormControl>
          <FormControl
            error={state.errors["password"] || state.errors["password"] === ""}
            fullWidth
            margin="normal"
            variant="outlined"
          >
            <InputLabel htmlFor="label-password">Password</InputLabel>
            <OutlinedInput
              id="password"
              value={state.fields["password"] || ""}
              onChange={(e) => handleChange("password", e.target.value)}
              label="Password"
              fullWidth
              required
              type="password"
            />
            <FormHelperText id="help-password">
              {state.errors["password"] || ""}
            </FormHelperText>
          </FormControl>

          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={isSubmit}
            className={classes.submit}
            onClick={() => _onSubmit()}
          >
            {isSubmit ? (
              <CircularProgress color="secondary" size={"1.4rem"} />
            ) : (
              "Login"
            )}
          </Button>
          <Grid container>
            <Grid item xs>
              {/* <Link href="#" variant="body2">
                Forgot password?
              </Link> */}
            </Grid>
            <Grid item>
              {/* <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link> */}
            </Grid>
          </Grid>
        </div>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
