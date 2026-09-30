import { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertDialog from "../../../../components/molecules/alert-dialog";
import FormControl from "../../../../components/molecules/form-control";
import Validate from "../../../../hooks/use-validate";
import Actions from "../../../../actions";
import type { AppDispatch } from "../../../../store";

type FormState = { fields: { name?: string }; errors: Record<string, string> };
type DialogType = "create" | "update" | "delete";
type TableRecord = { id: string; name?: string };
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
  const tables = useSelector((state: TableFormReduxState) => state.Tables);
  const dialog = useSelector(
    (state: TableFormReduxState) => state.Service.form_dialog,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (dialog.type === "update" && dialog.row) {
      setForm({ fields: { name: dialog.row.name }, errors: {} });
      return;
    }
    if (!dialog.open || !dialog.type) setForm(emptyForm);
  }, [dialog.open, dialog.row, dialog.type]);

  const closeDialog = () => dispatch(Actions.Service.hideFormDialog());
  const submitForm = async () => {
    const tableId = dialog.row?.id;
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
      <AlertDialog
        title="Tables delete"
        open={dialog.open}
        onClose={closeDialog}
        loading={tables.loading}
        onSubmit={submitForm}
      >
        Name : {dialog.row?.name || "name"}
      </AlertDialog>
    );
  }

  return (
    <AlertDialog
      title={`Tables ${dialog.type}`}
      open={dialog.open}
      onClose={closeDialog}
      loading={tables.loading}
      onSubmit={submitForm}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <FormControl
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
        </div>
      </div>
    </AlertDialog>
  );
};

export default TableForm;
