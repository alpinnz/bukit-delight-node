import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Grid, Box, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import ContainerCustom from "./../components/common/container.custom";
import ButtonCustom from "./../components/common/button.custom";
import FormControlCustom from "./../components/common/form.control.custom";
import TextCustom from "./../components/common/text.custom";
import Copyright from "./../components/templates/copyright";
import Validate from "./../components/hooks/use.validate.js";
import Actions from "./../actions";

const useStyles = makeStyles({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

const LoginPage = () => {
  const [state, setState] = useState({
    fields: {},
    errors: {},
  });
  const Authentication = useSelector((state) => state.Authentication);
  const classes = useStyles();
  const dispatch = useDispatch();

  if (Authentication.account.username) {
    return <Redirect to={{ pathname: "/admin" }} />;
  }

  const handleChange = (field, value) => {
    let fields = state.fields;

    fields[field] = value;
    setState({ ...state, fields });
  };

  const onSubmit = async () => {
    const formSet = [
      {
        key: "username",
        validate: ["required"],
      },
      {
        key: "password",
        validate: ["required"],
      },
    ];
    const validate = await Validate(state, setState, formSet);
    if (validate) {
      dispatch(Actions.Authentication.onLogin(state.fields));
    }
  };

  return (
    <ContainerCustom title="Login" maxWidth="xs">
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={12}>
          <div className={classes.paper}>
            <TextCustom component="h1" variant="h5">
              Login
            </TextCustom>
            <div className={classes.form}>
              <FormControlCustom
                error={state.errors["username"]}
                label="Username"
                value={state.fields["username"]}
                onChange={(e) => handleChange("username", e.target.value)}
                type="text"
                required
              />

              <FormControlCustom
                error={state.errors["password"]}
                label="Password"
                value={state.fields["password"]}
                onChange={(e) => handleChange("password", e.target.value)}
                type="password"
                required
              />

              <ButtonCustom
                label="Login"
                disabled={Authentication.loading}
                loading={Authentication.loading}
                onClick={() => onSubmit()}
                fullWidth
              />

              <Grid container>
                <Grid item xs>
                  {/* <Link to="#" variant="body2">
                    Forgot password?
                  </Link> */}
                </Grid>
                <Grid item>
                  {/* <Link to="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link> */}
                </Grid>
              </Grid>
            </div>
          </div>
          <Box mt={8}>
            <Copyright />
          </Box>
        </Grid>
      </Grid>
    </ContainerCustom>
  );
};

export default withRouter(LoginPage);
