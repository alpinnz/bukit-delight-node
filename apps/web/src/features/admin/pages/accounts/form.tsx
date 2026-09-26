import { useEffect, useState, type ChangeEvent } from "react";
import { Grid } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import DialogCustom from "../../../../components/common/dialog.custom";
import FormControlCustom from "../../../../components/common/form.control.custom";
import Validate from "../../../../components/hooks/use.validate";
import Actions from "../../../../actions";

type AccountFields = Record<string, string>;
type FormState = { fields: AccountFields; errors: Record<string, string> };
type DialogType = "create" | "update" | "delete";
type Role = { _id: string; name: string };
type AccountRecord = {
  _id: string;
  username?: string;
  email?: string;
  id_role?: string | { _id?: string };
};
type AccountFormReduxState = {
  Accounts: { loading: boolean };
  Roles: { data: Role[] };
  Service: {
    form_dialog: {
      open: boolean;
      type?: DialogType;
      row?: AccountRecord;
    };
  };
};

const emptyForm: FormState = { fields: {}, errors: {} };

const AccountForm = () => {
  const { Accounts, Roles, Service } = useSelector(
    (state: AccountFormReduxState) => state,
  );
  const dispatch = useDispatch();
  const [form, setForm] = useState<FormState>(emptyForm);
  const dialog = Service.form_dialog;

  useEffect(() => {
    if (dialog.type === "update" && dialog.row) {
      const roleId =
        typeof dialog.row.id_role === "string"
          ? dialog.row.id_role
          : (dialog.row.id_role?._id ?? "");
      setForm({
        fields: {
          username: dialog.row.username ?? "",
          email: dialog.row.email ?? "",
          id_role: roleId,
        },
        errors: {},
      });
      return;
    }
    if (!dialog.open || !dialog.type) setForm(emptyForm);
  }, [dialog.open, dialog.row, dialog.type]);

  const updateField = (field: string, value: string) => {
    setForm((current) => ({
      fields: { ...current.fields, [field]: value },
      errors: { ...current.errors, [field]: "" },
    }));
  };

  const closeDialog = () => dispatch(Actions.Service.hideFormDialog());
  const submitForm = async () => {
    const accountId = dialog.row?._id;
    if (dialog.type === "delete" && accountId) {
      dispatch(Actions.Accounts.onDelete(accountId));
      return;
    }
    if (dialog.type !== "create" && dialog.type !== "update") return;
    if (dialog.type === "update" && !accountId) return;

    const validation = [
      { key: "username", validate: ["required"] },
      { key: "email", validate: ["required", "email"] },
      { key: "id_role", validate: ["required"] },
      ...(dialog.type === "create"
        ? [
            { key: "password", validate: ["required", "match-passowrd"] },
            {
              key: "repeat_password",
              validate: ["required", "match-passowrd"],
            },
          ]
        : []),
    ];
    const isValid = await Validate(form, setForm, validation);
    if (!isValid) return;

    if (dialog.type === "create") {
      dispatch(Actions.Accounts.onCreate(form.fields));
      return;
    }
    dispatch(Actions.Accounts.onUpdate(accountId, form.fields));
  };

  if (!dialog.open || !dialog.type) return null;
  if (dialog.type === "delete") {
    return (
      <DialogCustom
        title="Account delete"
        open={dialog.open}
        onClose={closeDialog}
        loading={Accounts.loading}
        onSubmit={submitForm}
      >
        Username : {dialog.row?.username || "username"}
      </DialogCustom>
    );
  }

  const isCreating = dialog.type === "create";
  return (
    <DialogCustom
      title={`Account ${dialog.type}`}
      open={dialog.open}
      onClose={closeDialog}
      loading={Accounts.loading}
      onSubmit={submitForm}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControlCustom
            error={form.errors.username}
            label="Username"
            value={form.fields.username}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateField("username", event.currentTarget.value)
            }
            type="text"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlCustom
            data={Roles.data}
            error={form.errors.id_role}
            label="Role"
            value={form.fields.id_role}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateField("id_role", event.target.value)
            }
            type="select"
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlCustom
            error={form.errors.email}
            label="Email"
            value={form.fields.email}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateField("email", event.currentTarget.value)
            }
            type="text"
            required
          />
        </Grid>
        {isCreating && (
          <>
            <Grid item xs={12} sm={6}>
              <FormControlCustom
                error={form.errors.password}
                label="Password"
                value={form.fields.password}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateField("password", event.currentTarget.value)
                }
                type="password"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlCustom
                error={form.errors.repeat_password}
                label="Repeat Password"
                value={form.fields.repeat_password}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateField("repeat_password", event.currentTarget.value)
                }
                type="password"
                required
              />
            </Grid>
          </>
        )}
      </Grid>
    </DialogCustom>
  );
};

export default AccountForm;
