/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@material-ui/core";
import Actions from "./../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Axios from "./../../../helpers/axios";

const URL_PATH = "api/v1/menus";

export default function Form({ form, setForm }) {
  const Roles = useSelector((state) => state.Roles.data);
  const [state, setState] = React.useState({
    fields: {},
    errors: {},
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (form.open) {
      if (form.type === "edit") {
        const row = {
          username: form.row.username,
          email: form.row.email,
          roles: form.row._id_roles,
        };
        console.log(row);
        setState({
          fields: row,
          errors: {},
        });
      }
    } else {
      setState({
        fields: {},
        errors: {},
      });
    }
  }, [form]);

  const title = () => {
    let result = "";
    switch (form.type) {
      case "add":
        result = "Add Accounts";
        break;
      case "edit":
        result = "Edit Accounts";
        break;
      case "delete":
        result = "Delete Accounts";
        break;
      default:
        result = "";
        break;
    }
    return result;
  };

  const handleChange = (field, value) => {
    let fields = state.fields;

    fields[field] = value;
    setState({ ...state, fields });
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

    if (!fields["email"]) {
      formIsValid = false;
      errors["email"] = "Cannot be empty";
    }

    if (!fields["roles"]) {
      formIsValid = false;
      errors["roles"] = "Cannot be empty";
    }

    setState({ ...state, errors: errors });
    return formIsValid;
  };

  const Load_API = async () => {
    await Axios.get(URL_PATH)
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Accounts.UPDATE(data));
      })
      .catch((err) => {
        dispatch(Actions.Services.popupNotification(err.toString()));
        console.log(err);
      });
  };

  const onAdd = async () => {
    const formData = new FormData();
    formData.append("name", state.fields["name"]);
    formData.append("desc", state.fields["desc"]);
    formData.append("price", state.fields["price"]);
    formData.append("id_category", state.fields["categories"]);
    formData.append("image", state.fields["image"]);

    await Axios.post(URL_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response);
        Load_API();
        dispatch(Actions.Services.popupNotification("Add"));
      })
      .catch((err) => {
        dispatch(Actions.Services.popupNotification(err.toString()));
        console.log(err);
      });
    setForm({ ...form, open: false });
  };

  const onDelete = async () => {
    const _id = form.row._id;
    await Axios.delete(`${URL_PATH}/${_id}`)
      .then((response) => {
        console.log(response);
        Load_API();
        dispatch(Actions.Services.popupNotification("Delete"));
      })
      .catch((err) => {
        dispatch(Actions.Services.popupNotification(err.toString()));
        console.log(err);
      });
    setForm({ ...form, open: false });
  };

  const onEdit = async () => {
    const _id = form.row._id;
    const formData = new FormData();
    formData.append("name", state.fields["name"]);
    formData.append("desc", state.fields["desc"]);
    if (state.fields["image"]) {
      formData.append("image", state.fields["image"]);
    }

    await Axios.put(`${URL_PATH}/${_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response);
        Load_API();
        dispatch(Actions.Services.popupNotification("Edit"));
      })
      .catch((err) => {
        dispatch(Actions.Services.popupNotification(err.toString()));
        console.log(err);
      });
    setForm({ ...form, open: false });
  };

  const _onSubmit = () => {
    if (handleValidation()) {
      if (form.type === "add") {
        onAdd();
      }
      if (form.type === "edit") {
        onEdit();
      }
    }
  };

  const _onClose = () => setForm({ ...form, open: false, type: null, row: {} });

  if (form.type === "delete") {
    return (
      <div>
        <Dialog
          open={form.open}
          onClose={() => _onClose()}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="responsive-dialog-title">{`Really delete ${form.row.name} !!!`}</DialogTitle>
          <DialogActions>
            <Button onClick={() => _onClose()} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={() => onDelete()} color="primary" autoFocus>
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  return (
    <Dialog
      open={form.open}
      onClose={() => _onClose()}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{`${title()}`}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl
              error={
                state.errors["username"] || state.errors["username"] === ""
              }
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="label-username">Username</InputLabel>
              <OutlinedInput
                labelId="label-username"
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
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              error={state.errors["roles"] || state.errors["roles"] === ""}
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="label-roles">Roles</InputLabel>
              <Select
                labelId="label-roles"
                value={state.fields["roles"] || ""}
                onChange={(e) => handleChange("roles", e.target.value)}
                label="Roles"
              >
                {Roles.map((e) => {
                  return (
                    <MenuItem
                      selected={
                        state.fields["roles"] === e["_id"] ? true : false
                      }
                      value={e["_id"]}
                    >
                      {e["name"]}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText id="help-roles">
                {state.errors["roles"] || ""}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl
              error={state.errors["email"] || state.errors["email"] === ""}
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="label-email">Email</InputLabel>
              <OutlinedInput
                type="email"
                labelId="label-email"
                value={state.fields["email"] || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                label="Desc"
                fullWidth
                required
              />
              <FormHelperText id="help-email">
                {state.errors["email"] || ""}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              error={
                state.errors["password"] || state.errors["password"] === ""
              }
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="label-email">Password</InputLabel>
              <OutlinedInput
                type="email"
                labelId="label-password"
                value={state.fields["password"] || ""}
                onChange={(e) => handleChange("password", e.target.value)}
                label="Password"
                fullWidth
                required
              />
              <FormHelperText id="help-password">
                {state.errors["password"] || ""}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              error={
                state.errors["repeat_password"] ||
                state.errors["repeat_password"] === ""
              }
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="label-repeat_password">
                Repeat Password
              </InputLabel>
              <OutlinedInput
                type="email"
                labelId="label-repeat_password"
                value={state.fields["repeat_password"] || ""}
                onChange={(e) =>
                  handleChange("repeat_password", e.target.value)
                }
                label="Repeat Password"
                fullWidth
                required
              />
              <FormHelperText id="help-repeat_password">
                {state.errors["repeat_password"] || ""}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => _onClose()} color="primary" autoFocus>
          Cancel
        </Button>
        <Button onClick={() => _onSubmit()} color="primary" autoFocus>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
