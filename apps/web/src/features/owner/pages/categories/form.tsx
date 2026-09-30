import { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import AlertDialog from "../../../../components/molecules/alert-dialog";
import FormControl from "../../../../components/molecules/form-control";
import Validate from "../../../../hooks/use-validate";
import Actions from "../../../../actions";
import type { AppDispatch } from "../../../../store";

type CategoryFields = { name?: string; desc?: string; image?: File };
type FormState = { fields: CategoryFields; errors: Record<string, string> };
type DialogType = "create" | "update" | "delete";
type CategoryRecord = { id: string; name?: string; desc?: string };
type CategoryFormReduxState = {
  Categories: { loading: boolean };
  Service: {
    form_dialog: {
      open: boolean;
      type?: DialogType;
      row?: CategoryRecord;
    };
  };
};

const emptyForm: FormState = { fields: {}, errors: {} };

const CategoryForm = () => {
  const categories = useSelector(
    (state: CategoryFormReduxState) => state.Categories,
  );
  const dialog = useSelector(
    (state: CategoryFormReduxState) => state.Service.form_dialog,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (dialog.type === "update" && dialog.row) {
      setForm({
        fields: { name: dialog.row.name, desc: dialog.row.desc },
        errors: {},
      });
      return;
    }

    if (!dialog.open || !dialog.type) setForm(emptyForm);
  }, [dialog.open, dialog.row, dialog.type]);

  const changeField = (
    field: keyof CategoryFields,
    value: string | File | undefined,
  ) => {
    setForm((current) => ({
      fields: { ...current.fields, [field]: value },
      errors: { ...current.errors, [field]: "" },
    }));
  };

  const closeDialog = () => dispatch(Actions.Service.hideFormDialog());

  const submitForm = async () => {
    const categoryId = dialog.row?.id;

    if (dialog.type === "delete" && categoryId) {
      dispatch(Actions.Categories.onDelete(categoryId));
      return;
    }

    if (dialog.type !== "create" && dialog.type !== "update") return;
    if (dialog.type === "update" && !categoryId) return;

    const requiredFields = [
      { key: "name", validate: ["required"] },
      { key: "desc", validate: ["required"] },
      ...(dialog.type === "create"
        ? [{ key: "image", validate: ["required"] }]
        : []),
    ];
    const isValid = await Validate(form, setForm, requiredFields);
    if (!isValid) return;

    if (dialog.type === "create") {
      dispatch(Actions.Categories.onCreate(form.fields));
      return;
    }
    dispatch(Actions.Categories.onUpdate(categoryId, form.fields));
  };

  if (!dialog.open || !dialog.type) return null;

  const title = `Categories ${dialog.type}`;
  if (dialog.type === "delete") {
    return (
      <AlertDialog
        title={title}
        open={dialog.open}
        onClose={closeDialog}
        loading={categories.loading}
        onSubmit={submitForm}
      >
        Name : {dialog.row?.name || "name"}
      </AlertDialog>
    );
  }

  return (
    <AlertDialog
      title={title}
      open={dialog.open}
      onClose={closeDialog}
      loading={categories.loading}
      onSubmit={submitForm}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <FormControl
            error={form.errors.name}
            label="Name"
            value={form.fields.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              changeField("name", event.currentTarget.value)
            }
            type="text"
            required
          />
        </div>
        <div>
          <FormControl
            error={form.errors.desc}
            label="Description"
            value={form.fields.desc}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              changeField("desc", event.currentTarget.value)
            }
            type="text"
            required
          />
        </div>
        <div className="sm:col-span-2">
          <FormControl
            error={form.errors.image}
            label="Image"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              changeField("image", event.currentTarget.files?.[0])
            }
            type="file"
            required={dialog.type === "create"}
          />
        </div>
      </div>
    </AlertDialog>
  );
};

export default CategoryForm;
