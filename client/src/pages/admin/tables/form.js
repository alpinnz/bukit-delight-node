import React, { useState, useEffect } from "react";
import DialogCustom from "./../../../components/common/dialog.custom";
import Actions from "./../../../actions";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import FormControlCustom from "./../../../components/common/form.control.custom";
import Validate from "./../../../components/hooks/use.validate.js";

const Form = () => {
  const Tables = useSelector((state) => state.Tables);
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
          name: row.name,
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
      dispatch(Actions.Tables.onDelete(_id));
    } else {
      if (type === "create") {
        const formSet = [
          {
            key: "name",
            validate: ["required"],
          },
        ];
        const validate = await Validate(state, setState, formSet);
        if (validate) {
          dispatch(Actions.Tables.onCreate(state.fields));
        }
      }
      if (type === "update") {
        const formSet = [
          {
            key: "name",
            validate: ["required"],
          },
        ];
        const validate = await Validate(state, setState, formSet);
        if (validate) {
          dispatch(Actions.Tables.onUpdate(_id, state.fields));
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
          title="Tables create"
          open={Service.form_dialog.open}
          onClose={closeDialog}
          loading={Tables.loading}
          onSubmit={onSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <FormControlCustom
                error={state.errors["name"]}
                label="name"
                value={state.fields["name"]}
                onChange={(e) => handleChange("name", e.target.value)}
                type="text"
                required
              />
            </Grid>
          </Grid>
        </DialogCustom>
      );
    } else if (type === "update") {
      return (
        <DialogCustom
          title="Tables update"
          open={Service.form_dialog.open}
          onClose={closeDialog}
          loading={Tables.loading}
          onSubmit={onSubmit}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <FormControlCustom
                error={state.errors["name"]}
                label="name"
                value={state.fields["name"]}
                onChange={(e) => handleChange("name", e.target.value)}
                type="text"
                required
              />
            </Grid>
          </Grid>
        </DialogCustom>
      );
    } else if (type === "delete") {
      return (
        <DialogCustom
          title="Tables delete"
          open={Service.form_dialog.open}
          onClose={closeDialog}
          loading={Tables.loading}
          onSubmit={onSubmit}
        >
          Name : {Service.form_dialog.row.name || "name"}
        </DialogCustom>
      );
    }
  }
  return <div />;
};

export default Form;
