import { useEffect, useState, type ChangeEvent } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import DialogCustom from "../../../../components/common/dialog.custom";
import FormControlCustom from "../../../../components/common/form.control.custom";
import Validate from "../../../../components/hooks/use.validate";
import Actions from "../../../../actions";

type MenuFields = Record<string, string | boolean | File>;
type FormState = { fields: MenuFields; errors: Record<string, string> };
type DialogType = "create" | "update" | "delete";
type Category = { _id: string; name: string };
type MenuRecord = {
  _id: string;
  name?: string;
  desc?: string;
  price?: number;
  duration?: number;
  promo?: number;
  id_category?: string | { _id?: string };
  isAvailable?: boolean;
  isFavorite?: boolean;
};
type MenuFormReduxState = {
  Menus: { loading: boolean };
  Categories: { data: Category[] };
  Service: {
    form_dialog: { open: boolean; type?: DialogType; row?: MenuRecord };
  };
};

const emptyForm: FormState = { fields: {}, errors: {} };

const MenuForm = () => {
  const { Menus, Categories, Service } = useSelector(
    (state: MenuFormReduxState) => state,
  );
  const dispatch = useDispatch();
  const [form, setForm] = useState<FormState>(emptyForm);
  const dialog = Service.form_dialog;

  useEffect(() => {
    if (dialog.type === "update" && dialog.row) {
      const categoryId =
        typeof dialog.row.id_category === "string"
          ? dialog.row.id_category
          : (dialog.row.id_category?._id ?? "");
      setForm({
        fields: {
          name: dialog.row.name ?? "",
          desc: dialog.row.desc ?? "",
          price: String(dialog.row.price ?? ""),
          duration: String(dialog.row.duration ?? ""),
          ...(dialog.row.promo !== undefined
            ? { promo: String(dialog.row.promo) }
            : {}),
          id_category: categoryId,
          isAvailable: Boolean(dialog.row.isAvailable),
          isFavorite: Boolean(dialog.row.isFavorite),
        },
        errors: {},
      });
      return;
    }
    if (!dialog.open || !dialog.type) setForm(emptyForm);
  }, [dialog.open, dialog.row, dialog.type]);

  const updateField = (
    field: string,
    value: string | boolean | File | undefined,
  ) => {
    setForm((current) => ({
      fields: { ...current.fields, [field]: value ?? "" },
      errors: { ...current.errors, [field]: "" },
    }));
  };

  const closeDialog = () => dispatch(Actions.Service.hideFormDialog());
  const submitForm = async () => {
    const menuId = dialog.row?._id;
    if (dialog.type === "delete" && menuId) {
      dispatch(Actions.Menus.onDelete(menuId));
      return;
    }
    if (dialog.type !== "create" && dialog.type !== "update") return;
    if (dialog.type === "update" && !menuId) return;

    const validations = [
      { key: "name", validate: ["required"] },
      { key: "desc", validate: ["required"] },
      { key: "price", validate: ["required", "number"] },
      { key: "duration", validate: ["required", "number"] },
      { key: "id_category", validate: ["required"] },
      ...(dialog.type === "create"
        ? [{ key: "image", validate: ["required"] }]
        : [{ key: "promo", validate: ["number"] }]),
    ];
    const isValid = await Validate(form, setForm, validations);
    if (!isValid) return;

    if (dialog.type === "create") {
      dispatch(Actions.Menus.onCreate(form.fields));
      return;
    }
    dispatch(Actions.Menus.onUpdate(menuId, form.fields));
  };

  if (!dialog.open || !dialog.type) return null;
  if (dialog.type === "delete") {
    return (
      <DialogCustom
        title="Menus delete"
        open={dialog.open}
        onClose={closeDialog}
        loading={Menus.loading}
        onSubmit={submitForm}
      >
        Name : {dialog.row?.name || "name"}
      </DialogCustom>
    );
  }

  const isCreating = dialog.type === "create";
  const textField = (
    label: string,
    field: string,
    type: string,
    required = true,
  ) => (
    <FormControlCustom
      error={form.errors[field]}
      label={label}
      value={
        typeof form.fields[field] === "string"
          ? (form.fields[field] as string)
          : ""
      }
      onChange={(event: ChangeEvent<HTMLInputElement>) =>
        updateField(field, event.currentTarget.value)
      }
      type={type}
      required={required}
    />
  );

  return (
    <DialogCustom
      title={`Menus ${dialog.type}`}
      open={dialog.open}
      onClose={closeDialog}
      loading={Menus.loading}
      onSubmit={submitForm}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          {textField("Name", "name", "text")}
        </Grid>
        <Grid item xs={12} sm={6}>
          {textField("Description", "desc", "text")}
        </Grid>
        <Grid item xs={12} sm={6}>
          {textField("Price", "price", "number")}
        </Grid>
        <Grid item xs={12} sm={6}>
          {textField("Promo", "promo", "number", !isCreating)}
        </Grid>
        <Grid item xs={12} sm={6}>
          {textField("Duration", "duration", "duration")}
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlCustom
            data={Categories.data}
            error={form.errors.id_category}
            label="Categories"
            value={
              typeof form.fields.id_category === "string"
                ? form.fields.id_category
                : ""
            }
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateField("id_category", event.target.value)
            }
            type="select"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlCustom
            error={form.errors.image}
            label="Image"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateField("image", event.currentTarget.files?.[0])
            }
            type="file"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlCustom
            error={form.errors.isAvailable}
            label="Available"
            value={Boolean(form.fields.isAvailable)}
            onChange={(
              _event: ChangeEvent<HTMLInputElement>,
              checked: boolean,
            ) => updateField("isAvailable", checked)}
            type="switch"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlCustom
            error={form.errors.isFavorite}
            label="Favorite"
            value={Boolean(form.fields.isFavorite)}
            onChange={(
              _event: ChangeEvent<HTMLInputElement>,
              checked: boolean,
            ) => updateField("isFavorite", checked)}
            type="switch"
          />
        </Grid>
      </Grid>
    </DialogCustom>
  );
};

export default MenuForm;
