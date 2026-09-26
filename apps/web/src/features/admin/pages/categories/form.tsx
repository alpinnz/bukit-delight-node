import { useEffect, useState, type ChangeEvent } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import DialogCustom from "../../../../components/common/dialog.custom";
import FormControlCustom from "../../../../components/common/form.control.custom";
import Validate from "../../../../components/hooks/use.validate";
import Actions from "../../../../actions";

type CategoryFields = { name?: string; desc?: string; image?: File };
type FormState = { fields: CategoryFields; errors: Record<string, string> };
type DialogType = "create" | "update" | "delete";
type CategoryRecord = { _id: string; name?: string; desc?: string };
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
  const { Categories, Service } = useSelector(
    (state: CategoryFormReduxState) => state,
  );
  const dispatch = useDispatch();
  const [form, setForm] = useState<FormState>(emptyForm);
  const dialog = Service.form_dialog;

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
    const categoryId = dialog.row?._id;

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
      <DialogCustom
        title={title}
        open={dialog.open}
        onClose={closeDialog}
        loading={Categories.loading}
        onSubmit={submitForm}
      >
        Name : {dialog.row?.name || "name"}
      </DialogCustom>
    );
  }

  return (
    <DialogCustom
      title={title}
      open={dialog.open}
      onClose={closeDialog}
      loading={Categories.loading}
      onSubmit={submitForm}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControlCustom
            error={form.errors.name}
            label="Name"
            value={form.fields.name}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              changeField("name", event.currentTarget.value)
            }
            type="text"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlCustom
            error={form.errors.desc}
            label="Description"
            value={form.fields.desc}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              changeField("desc", event.currentTarget.value)
            }
            type="text"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlCustom
            error={form.errors.image}
            label="Image"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              changeField("image", event.currentTarget.files?.[0])
            }
            type="file"
            required={dialog.type === "create"}
          />
        </Grid>
      </Grid>
    </DialogCustom>
  );
};

export default CategoryForm;
