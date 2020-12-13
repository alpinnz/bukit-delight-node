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

const URL_PATH = "api/v1/tables";

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
        result = "Add table";
        break;
      case "edit":
        result = "Edit table";
        break;
      case "delete":
        result = "Delete table";
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

    setState({ ...state, errors: errors });
    return formIsValid;
  };

  const Load_API = async () => {
    await Axios.get(URL_PATH)
      .then((response) => {
        console.log(response);
        const data = response["data"]["data"];
        dispatch(Actions.TablesAction.TablesUpdate(data));
      })
      .catch((err) => {
        dispatch(Actions.ServicesAction.popupNotification(err.toString()));
        console.log(err);
      });
  };

  const onAdd = async () => {
    const formData = new FormData();
    formData.append("name", state.fields["name"]);

    Axios.post(URL_PATH, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response);
        Load_API();
        dispatch(Actions.ServicesAction.popupNotification("Add table"));
      })
      .catch((err) => {
        dispatch(Actions.ServicesAction.popupNotification(err.toString()));
        console.log(err);
      });
    setForm({ ...form, open: false });
  };

  const onDelete = async () => {
    const _id = form.row._id;
    Axios.delete(`${URL_PATH}/${_id}`)
      .then((response) => {
        console.log(response);
        Load_API();
        dispatch(Actions.ServicesAction.popupNotification("Delete table"));
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

    await Axios.put(`${URL_PATH}/${_id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        console.log(response);
        Load_API();
        dispatch(Actions.ServicesAction.popupNotification("Edit table"));
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
          <Grid item xs={12} sm={12}>
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
