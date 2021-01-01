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
  CircularProgress,
} from "@material-ui/core";
import Actions from "./../../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import Axios from "./../../../helpers/axios";

const URL_PATH = "api/v1/accounts";

export default function Form({ form, setForm }) {
  const Roles = useSelector((state) => state.Roles.data);
  const [isSubmit, setIsSubmit] = React.useState(false);
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

    if (typeof fields["email"] !== "undefined") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(fields["email"])) {
        formIsValid = false;
        errors["email"] = "Email not valid";
      }
    }

    if (!fields["password"]) {
      formIsValid = false;
      errors["password"] = "Cannot be empty";
    }

    if (!fields["repeat_password"]) {
      formIsValid = false;
      errors["repeat_password"] = "Cannot be empty";
    }

    if (
      typeof fields["password"] !== "undefined" &&
      typeof fields["repeat_password"] !== "undefined"
    ) {
      if (fields["password"] !== fields["repeat_password"]) {
        formIsValid = false;
        errors["password"] = "Password not match";
        errors["repeat_password"] = "Password not match";
      }
    }

    setState({ ...state, errors: errors });
    return formIsValid;
  };

  const LOAD_API_GET = async () => {
    await Axios.get(URL_PATH)
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Accounts.UPDATE(data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(Actions.Services.popupNotification(err.toString()));
      });
  };

  const onAdd = async () => {
    setIsSubmit(true);
    const formData = new FormData();
    formData.append("username", state.fields["username"]);
    formData.append("email", state.fields["email"]);
    formData.append("id_role", state.fields["roles"]);
    formData.append("password", state.fields["password"]);
    formData.append("repeat_password", state.fields["repeat_password"]);

    await Axios.post(URL_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response);
        LOAD_API_GET();
        setTimeout(() => {
          setForm({ ...form, open: false });
          setIsSubmit(false);
          dispatch(Actions.Services.popupNotification("Add Accounts"));
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        setTimeout(() => {
          setIsSubmit(false);
          dispatch(Actions.Services.popupNotification(`Add Accounts :${err}`));
        }, 1500);
      });
  };

  const onDelete = async () => {
    setIsSubmit(true);
    const _id = form.row._id;
    await Axios.delete(`${URL_PATH}/${_id}`)
      .then((response) => {
        console.log(response);
        LOAD_API_GET();
        setTimeout(() => {
          setForm({ ...form, open: false });
          setIsSubmit(false);
          dispatch(Actions.Services.popupNotification("Delete Accounts"));
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        setTimeout(() => {
          setIsSubmit(false);
          dispatch(
            Actions.Services.popupNotification(`Delete Accounts :${err}`)
          );
        }, 1500);
      });
  };

  const onEdit = async () => {
    setIsSubmit(true);
    const _id = form.row._id;
    const formData = new FormData();
    formData.append("username", state.fields["username"]);
    formData.append("email", state.fields["email"]);
    formData.append("id_role", state.fields["roles"]);
    formData.append("password", state.fields["password"]);
    formData.append("repeat_password", state.fields["repeat_password"]);

    await Axios.put(`${URL_PATH}/${_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response);
        LOAD_API_GET();
        setTimeout(() => {
          setForm({ ...form, open: false });
          setIsSubmit(false);
          dispatch(Actions.Services.popupNotification("Edit Accounts"));
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
        setTimeout(() => {
          setIsSubmit(false);
          dispatch(Actions.Services.popupNotification(`Edit Accounts :${err}`));
        }, 1500);
      });
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
            <Button
              variant="contained"
              onClick={() => _onClose()}
              color="primary"
              style={{ width: "5.25rem", height: "2.25rem" }}
            >
              Cancel
            </Button>
            <Button
              disabled={isSubmit}
              variant="contained"
              onClick={() => onDelete()}
              color="primary"
              autoFocus
              style={{ width: "5.25rem", height: "2.25rem" }}
            >
              {isSubmit ? (
                <CircularProgress color="secondary" size={"1.4rem"} />
              ) : (
                "Submit"
              )}
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
                      key={e}
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
                labelId="label-password"
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
                labelId="label-repeat_password"
                value={state.fields["repeat_password"] || ""}
                onChange={(e) =>
                  handleChange("repeat_password", e.target.value)
                }
                label="Repeat Password"
                fullWidth
                required
                type="password"
              />
              <FormHelperText id="help-repeat_password">
                {state.errors["repeat_password"] || ""}
              </FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          style={{ width: "5.25rem", height: "2.25rem" }}
          variant="contained"
          onClick={() => _onClose()}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          disabled={isSubmit}
          variant="contained"
          onClick={() => _onSubmit()}
          color="primary"
          autoFocus
          style={{ width: "5.25rem", height: "2.25rem" }}
        >
          {isSubmit ? (
            <CircularProgress color="secondary" size={"1.4rem"} />
          ) : (
            "Submit"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
