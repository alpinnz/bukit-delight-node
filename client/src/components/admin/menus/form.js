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
  const Categories = useSelector((state) => state.Categories.data);
  const [state, setState] = React.useState({
    fields: {},
    errors: {},
  });
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (form.open) {
      if (form.type === "edit") {
        const row = {
          name: form.row.name,
          desc: form.row.desc,
          price: form.row.price,
          categories: form.row._id_categories,
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
        result = "Add Menus";
        break;
      case "edit":
        result = "Edit Menus";
        break;
      case "delete":
        result = "Delete Menus";
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
    if (!fields["name"]) {
      formIsValid = false;
      errors["name"] = "Cannot be empty";
    }

    if (!fields["desc"]) {
      formIsValid = false;
      errors["desc"] = "Cannot be empty";
    }

    if (!fields["price"]) {
      formIsValid = false;
      errors["price"] = "Cannot be empty";
    }

    if (typeof fields["price"] !== "undefined") {
      if (!fields["price"].match(/^[0-9]+$/)) {
        formIsValid = false;
        errors["price"] = "Only numbers";
      }
    }

    if (!fields["categories"]) {
      formIsValid = false;
      errors["categories"] = "Cannot be empty";
    }

    if (form.type === "add") {
      if (!fields["image"]) {
        formIsValid = false;
        errors["image"] = "Cannot be empty";
      }
    }

    setState({ ...state, errors: errors });
    return formIsValid;
  };

  const Load_API = async () => {
    await Axios.get(URL_PATH)
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.MenusAction.MenusUpdate(data));
      })
      .catch((err) => {
        dispatch(Actions.ServicesAction.popupNotification(err.toString()));
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
        dispatch(Actions.ServicesAction.popupNotification("Add"));
      })
      .catch((err) => {
        dispatch(Actions.ServicesAction.popupNotification(err.toString()));
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
        dispatch(Actions.ServicesAction.popupNotification("Delete"));
      })
      .catch((err) => {
        dispatch(Actions.ServicesAction.popupNotification(err.toString()));
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
        dispatch(Actions.ServicesAction.popupNotification("Edit"));
      })
      .catch((err) => {
        dispatch(Actions.ServicesAction.popupNotification(err.toString()));
        console.log(err);
      });
    setForm({ ...form, open: false });
  };

  const _onSubmit = () => {
    if (handleValidation()) {
      if (form.type === "add") {
        onAdd();
      } else if (form.type === "edit") {
        onEdit();
      }

      // setForm({ ...form, open: false });
    } else {
      // dispatch(Actions.ServicesAction.popupNotification("Failed form"));
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
          {/* <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {`Really delete ${form.row.name} !!!`}
            </DialogContentText>
          </DialogContent> */}
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
                state.errors["name"] || state.errors["name"] === ""
                  ? true
                  : false
              }
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="label-name">Name</InputLabel>
              <OutlinedInput
                labelId="label-name"
                value={state.fields["name"] || ""}
                onChange={(e) => handleChange("name", e.target.value)}
                label="Name"
                fullWidth
                required
              />
              <FormHelperText id="help-name">
                {state.errors["name"] || ""}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl
              error={
                state.errors["desc"] || state.errors["desc"] === ""
                  ? true
                  : false
              }
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="label-desc">Desc</InputLabel>
              <OutlinedInput
                labelId="label-desc"
                value={state.fields["desc"] || ""}
                onChange={(e) => handleChange("desc", e.target.value)}
                label="Desc"
                fullWidth
                required
              />
              <FormHelperText id="help-desc">
                {state.errors["desc"] || ""}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl
              error={
                state.errors["price"] || state.errors["price"] === ""
                  ? true
                  : false
              }
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="label-price">Price</InputLabel>
              <OutlinedInput
                labelId="label-price"
                type="number"
                value={state.fields["price"] || ""}
                onChange={(e) => handleChange("price", e.target.value)}
                label="Name"
                fullWidth
                required
              />
              <FormHelperText id="help-price">
                {state.errors["price"] || ""}
              </FormHelperText>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl
              error={
                state.errors["categories"] || state.errors["categories"] === ""
                  ? true
                  : false
              }
              fullWidth
              variant="outlined"
            >
              <InputLabel htmlFor="label-categories">Categories</InputLabel>
              <Select
                labelId="label-categories"
                value={state.fields["categories"] || ""}
                onChange={(e) => handleChange("categories", e.target.value)}
                label="Categories"
              >
                {Categories.map((e) => {
                  return (
                    <MenuItem
                      selected={
                        state.fields["categories"] === e["_id"] ? true : false
                      }
                      value={e["_id"]}
                    >
                      {e["name"]}
                    </MenuItem>
                  );
                })}
              </Select>
              <FormHelperText id="help-categories">
                {state.errors["categories"] || ""}
              </FormHelperText>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl
              error={
                state.errors["image"] || state.errors["image"] === ""
                  ? true
                  : false
              }
              fullWidth
              variant="outlined"
            >
              <OutlinedInput
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => handleChange("image", e.target.files[0])}
                fullWidth
                required
              />
              <FormHelperText id="help-image">
                {state.errors["image"] || ""}
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
