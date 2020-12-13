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
  // DialogContentText,
} from "@material-ui/core";
import Actions from "./../../../redux/actions";
import { useDispatch } from "react-redux";
import Axios from "./../../../helpers/axios";

const URL_PATH = "api/v1/categories";

export default function Form({ form, setForm }) {
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
        };
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
        result = "Add Categories";
        break;
      case "edit":
        result = "Edit Categories";
        break;
      case "delete":
        result = "Delete Categories";
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

    // if (typeof fields["name"] !== "undefined") {
    //   if (!fields["name"].match(/^[a-zA-Z]+$/)) {
    //     formIsValid = false;
    //     errors["name"] = "Only letters";
    //   }
    // }

    if (!fields["desc"]) {
      formIsValid = false;
      errors["desc"] = "Cannot be empty";
    }

    // if (typeof fields["desc"] !== "undefined") {
    //   if (!fields["desc"].match(/^[a-zA-Z]+$/)) {
    //     formIsValid = false;
    //     errors["desc"] = "Only letters";
    //   }
    // }
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
    await Axios.get("api/v1/categories")
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.Categories.UPDATE(data));
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
