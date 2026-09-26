import { useEffect, useState, type ChangeEvent } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import DialogCustom from "../../../../components/common/dialog.custom";
import FormControlCustom from "../../../../components/common/form.control.custom";
import Validate from "../../../../components/hooks/use.validate";
import Actions from "../../../../actions";

type FormState = { fields: { name?: string }; errors: Record<string, string> };
type DialogType = "create" | "update" | "delete";
type TableRecord = { _id: string; name?: string };
type TableFormReduxState = {
  Tables: { loading: boolean };
  Service: {
    form_dialog: {
      open: boolean;
      type?: DialogType;
      row?: TableRecord;
    };
  };
};

const emptyForm: FormState = { fields: {}, errors: {} };

const TableForm = () => {
  const { Tables, Service } = useSelector(
    (state: TableFormReduxState) => state,
  );
  const dispatch = useDispatch();
  const [form, setForm] = useState<FormState>(emptyForm);
  const dialog = Service.form_dialog;

  useEffect(() => {
    if (dialog.type === "update" && dialog.row) {
      setForm({ fields: { name: dialog.row.name }, errors: {} });
      return;
    }
    if (!dialog.open || !dialog.type) setForm(emptyForm);
  }, [dialog.open, dialog.row, dialog.type]);

  const closeDialog = () => dispatch(Actions.Service.hideFormDialog());
  const submitForm = async () => {
    const tableId = dialog.row?._id;
    if (dialog.type === "delete" && tableId) {
      dispatch(Actions.Tables.onDelete(tableId));
      return;
    }
    if (dialog.type !== "create" && dialog.type !== "update") return;
    if (dialog.type === "update" && !tableId) return;

    const isValid = await Validate(form, setForm, [
      { key: "name", validate: ["required"] },
    ]);
    if (!isValid) return;

    if (dialog.type === "create") {
      dispatch(Actions.Tables.onCreate(form.fields));
      return;
    }
    dispatch(Actions.Tables.onUpdate(tableId, form.fields));
  };

  if (!dialog.open || !dialog.type) return null;

  if (dialog.type === "delete") {
    return (
      <DialogCustom
        title="Tables delete"
        open={dialog.open}
        onClose={closeDialog}
        loading={Tables.loading}
        onSubmit={submitForm}
      >
        Name : {dialog.row?.name || "name"}
      </DialogCustom>
    );
  }

  return (
    <DialogCustom
      title={`Tables ${dialog.type}`}
      open={dialog.open}
      onClose={closeDialog}
      loading={Tables.loading}
      onSubmit={submitForm}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControlCustom
            error={form.errors.name}
            label="name"
            value={form.fields.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const name = event.currentTarget.value;
              setForm((current) => ({
                fields: { ...current.fields, name },
                errors: { ...current.errors, name: "" },
              }));
            }}
            type="text"
            required
          />
        </Grid>
      </Grid>
    </DialogCustom>
  );
};

export default TableForm;
