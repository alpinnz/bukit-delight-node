import React, { useState, useEffect } from "react";
import DialogCustom from "./../../../components/common/dialog.custom";
import Actions from "./../../../actions";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import FormControlCustom from "./../../../components/common/form.control.custom";
import Validate from "./../../../components/hooks/use.validate.js";

const Form = () => {
  const Accounts = useSelector((state) => state.Accounts);
  const Roles = useSelector((state) => state.Roles);
  const Service = useSelector((state) => state.Service);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    fields: {},
    errors: {},
  });

  useEffect(() => {
    if (Service.form_dialog.type && Service.form_dialog.row) {
      const type = Service.form_dialog.type;
      const row = Service.form_dialog.row;
      if (type === "update") {
        const fields = {
          username: row.username,
          email: row.email,
          id_role: row.id_role._id ? row.id_role._id : "",
        };
        setState({
          fields: fields,
          errors: {},
        });
      }
    } else {
      setState({
        fields: {},
        errors: {},
      });
    }
  }, [Service.form_dialog.row, Service.form_dialog.type]);

  const handleChange = (field, value) => {
    let fields = state.fields;

    fields[field] = value;
    setState({ ...state, fields });
  };

  const onSubmit = async () => {
    const form_dialog = Service.form_dialog;
    const type = form_dialog.type;
    const _id = Service.form_dialog.row._id;
    if (type === "delete") {
      dispatch(Actions.Accounts.onDelete(_id));
    } else {
      if (type === "create") {
        const formSet = [
          {
            key: "username",
            validate: ["required"],
          },
          {
            key: "email",
            validate: ["required", "email"],
          },
          {
            key: "id_role",
            validate: ["required"],
          },
          {
            key: "password",
            validate: ["required", "match-passowrd"],
          },
          {
            key: "repeat_password",
            validate: ["required", "match-passowrd"],
          },
        ];
        const validate = await Validate(state, setState, formSet);
        if (validate) {
          dispatch(Actions.Accounts.onCreate(state.fields));
        }
      }
      if (type === "update") {
        const formSet = [
          {
            key: "username",
            validate: ["required"],
          },
          {
            key: "email",
            validate: ["required", "email"],
          },
          {
            key: "id_role",
            validate: ["required"],
          },
          // {
          //   key: "password",
          //   validate: ["required", "match-passowrd"],
          // },
          // {
          //   key: "repeat_password",
          //   validate: ["required", "match-passowrd"],
          // },
        ];
        const validate = await Validate(state, setState, formSet);
        if (validate) {
          dispatch(Actions.Accounts.onUpdate(_id, state.fields));
        }
      }
    }
  };
  const closeDialog = () => dispatch(Actions.Service.hideFormDialog());

  if (Service.form_dialog.open && Service.form_dialog.type) {
    const form_dialog = Service.form_dialog;
    const type = form_dialog.type;
    if (type === "create") {
      return (
        <DialogCustom
          title="Account create"
          open={Service.form_dialog.open}
          onClose={closeDialog}
          loading={Accounts.loading}
          onSubmit={onSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlCustom
                error={state.errors["username"]}
                label="Username"
                value={state.fields["username"]}
                onChange={(e) => handleChange("username", e.target.value)}
                type="text"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlCustom
                data={Roles.data}
                error={state.errors["id_role"]}
                label="Role"
                value={state.fields["id_role"]}
                onChange={(e) => handleChange("id_role", e.target.value)}
                type="select"
                required
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControlCustom
                error={state.errors["email"]}
                label="Email"
                value={state.fields["email"]}
                onChange={(e) => handleChange("email", e.target.value)}
                type="text"
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControlCustom
                error={state.errors["password"]}
                label="Password"
                value={state.fields["password"]}
                onChange={(e) => handleChange("password", e.target.value)}
                type="password"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlCustom
                error={state.errors["repeat_password"]}
                label="Repeat Password"
                value={state.fields["repeat_password"]}
                onChange={(e) =>
                  handleChange("repeat_password", e.target.value)
                }
                type="password"
                required
              />
            </Grid>
          </Grid>
        </DialogCustom>
      );
    } else if (type === "update") {
      return (
        <DialogCustom
          title="Account update"
          open={Service.form_dialog.open}
          onClose={closeDialog}
          loading={Accounts.loading}
          onSubmit={onSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControlCustom
                error={state.errors["username"]}
                label="Username"
                value={state.fields["username"]}
                onChange={(e) => handleChange("username", e.target.value)}
                type="text"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlCustom
                data={Roles.data}
                error={state.errors["id_role"]}
                label="Role"
                value={state.fields["id_role"]}
                onChange={(e) => handleChange("id_role", e.target.value)}
                type="select"
                required
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControlCustom
                error={state.errors["email"]}
                label="Email"
                value={state.fields["email"]}
                onChange={(e) => handleChange("email", e.target.value)}
                type="text"
                required
              />
            </Grid>
            {/* 
            <Grid item xs={12} sm={6}>
              <FormControlCustom
                error={state.errors["password"]}
                label="Password"
                value={state.fields["password"]}
                onChange={(e) => handleChange("password", e.target.value)}
                type="password"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlCustom
                error={state.errors["repeat_password"]}
                label="Repeat Password"
                value={state.fields["repeat_password"]}
                onChange={(e) =>
                  handleChange("repeat_password", e.target.value)
                }
                type="password"
                required
              />
            </Grid> */}
          </Grid>
        </DialogCustom>
      );
    } else if (type === "delete") {
      return (
        <DialogCustom
          title="Account delete"
          open={Service.form_dialog.open}
          onClose={closeDialog}
          loading={Accounts.loading}
          onSubmit={onSubmit}
        >
          Username : {Service.form_dialog.row.username || "username"}
        </DialogCustom>
      );
    }
  }
  return <div />;
};

export default Form;
