import React, { useState } from "react";
import { Grid, Box, makeStyles } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ContainerCustom from "./../../../components/common/container.custom";
import ButtonCustom from "./../../../components/common/button.custom";
import FormControlCustom from "./../../../components/common/form.control.custom";
import TextCustom from "./../../../components/common/text.custom";
import Copyright from "./../../../components/templates/copyright";
import Validate from "./../../../components/hooks/use.validate.js";
import Actions from "./../../../actions";

const useStyles = makeStyles({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

const Form = (props) => {
  const { username, table } = props;
  const [state, setState] = useState({
    fields: {},
    errors: {},
  });
  const Customers = useSelector((state) => state.Customers);
  const Tables = useSelector((state) => state.Tables);
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const handleChange = (field, value) => {
    let fields = state.fields;

    fields[field] = value;
    setState({ ...state, fields });
  };

  const onSubmit = async () => {
    const formSet = [
      {
        key: "username",
        validate: [username ? "required" : ""],
      },
      {
        key: "table",
        validate: [table ? "required" : ""],
      },
    ];
    const validate = await Validate(state, setState, formSet);

    if (validate) {
      if (username && table) {
        const table = Tables.data.find((e) => e["name"] === state.fields.table);
        if (table) {
          dispatch(Actions.Customers.onCreate(state.fields));
          // dispatch(Actions.Customers.setCustomer(state.fields.customer));
          // dispatch(Actions.Tables.setTable(state.fields.table));
          history.push(`/customer/init/${table.name}`);
        } else {
          dispatch(Actions.Service.pushInfoNotification("Table not found"));
        }
      } else if (username && !table) {
        dispatch(Actions.Customers.onCreate(state.fields));
      } else if (table && !username) {
        const table = Tables.data.find((e) => e["name"] === state.fields.table);
        if (table) {
          // dispatch(Actions.Tables.setTable(state.fields.table));
          history.push(`/customer/init/${table.name}`);
        } else {
          dispatch(Actions.Service.pushInfoNotification("Table not found"));
        }
      }
    }
  };

  return (
    <ContainerCustom title="Customer" maxWidth="xs">
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
              Customer
            </TextCustom>
            <div className={classes.form}>
              {username && (
                <FormControlCustom
                  error={state.errors["username"]}
                  label="Username"
                  value={state.fields["username"]}
                  onChange={(e) => handleChange("username", e.target.value)}
                  type="text"
                  required
                />
              )}
              {table && (
                <FormControlCustom
                  error={state.errors["table"]}
                  label="Table"
                  value={state.fields["table"]}
                  onChange={(e) => handleChange("table", e.target.value)}
                  type="text"
                  required
                />
              )}

              <ButtonCustom
                label="Submit"
                disabled={Customers.loading}
                loading={Customers.loading}
                onClick={onSubmit}
                fullWidth
              />
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

export default Form;
