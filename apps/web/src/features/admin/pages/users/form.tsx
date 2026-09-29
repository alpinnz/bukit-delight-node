import { useEffect, useState, type ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import DialogCustom from "../../../../components/common/dialog.custom";
import FormControlCustom from "../../../../components/common/form.control.custom";
import Validate from "../../../../components/hooks/use.validate";
import Actions from "../../../../actions";
import type { AppDispatch } from "../../../../store";

type AccountFields = {
  username?: string;
  email?: string;
  id_roles?: string[];
  password?: string;
  repeat_password?: string;
};
type FormState = { fields: AccountFields; errors: Record<string, string> };
type DialogType = "create" | "update" | "delete";
type Role = { _id: string; name: string };
type AccountRecord = {
  _id: string;
  username?: string;
  email?: string;
  id_roles?: { _id?: string }[];
};
type AccountFormReduxState = {
  Users: { loading: boolean };
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
  const users = useSelector(
    (state: AccountFormReduxState) => state.Users,
  );
  const roles = useSelector((state: AccountFormReduxState) => state.Roles);
  const dialog = useSelector(
    (state: AccountFormReduxState) => state.Service.form_dialog,
  );
  const dispatch = useDispatch<AppDispatch>();
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (dialog.type === "update" && dialog.row) {
      setForm({
        fields: {
          username: dialog.row.username ?? "",
          email: dialog.row.email ?? "",
          id_roles: dialog.row.id_roles?.flatMap((role) => role._id ?? []) ?? [],
        },
        errors: {},
      });
      return;
    }
    if (!dialog.open || !dialog.type) setForm(emptyForm);
  }, [dialog.open, dialog.row, dialog.type]);

  const updateField = (field: string, value: string | string[]) => {
    const fieldValue =
      field === "id_roles" && typeof value === "string" ? [value] : value;
    setForm((current) => ({
      fields: { ...current.fields, [field]: fieldValue } as AccountFields,
      errors: { ...current.errors, [field]: "" },
    }));
  };

  const closeDialog = () => dispatch(Actions.Service.hideFormDialog());
  const submitForm = async () => {
    const accountId = dialog.row?._id;
    if (dialog.type === "delete" && accountId) {
      dispatch(Actions.Users.onDelete(accountId));
      return;
    }
    if (dialog.type !== "create" && dialog.type !== "update") return;
    if (dialog.type === "update" && !accountId) return;

    const validation = [
      { key: "username", validate: ["required"] },
      { key: "email", validate: ["required", "email"] },
      { key: "id_roles", validate: ["required"] },
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
      dispatch(Actions.Users.onCreate(form.fields));
      return;
    }
    dispatch(Actions.Users.onUpdate(accountId, form.fields));
  };

  if (!dialog.open || !dialog.type) return null;
  if (dialog.type === "delete") {
    return (
      <DialogCustom
        title="Account delete"
        open={dialog.open}
        onClose={closeDialog}
        loading={users.loading}
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
      loading={users.loading}
      onSubmit={submitForm}
    >
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
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
        </div>
        <div>
          <FormControlCustom
            data={roles.data}
            error={form.errors.id_roles}
            label="Roles"
            value={form.fields.id_roles}
            onChange={(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
              updateField(
                "id_roles",
                Array.from((event.target as HTMLSelectElement).selectedOptions, (option) => option.value),
              )
            }
            type="select"
            multiple
            required
          />
        </div>
        <div className="sm:col-span-2">
          <FormControlCustom
            error={form.errors.email}
            label="Email"
            value={form.fields.email}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              updateField("email", event.currentTarget.value)
            }
            type="email"
            rest={{ autoComplete: "off" }}
            required
          />
        </div>
        {isCreating && (
          <>
            <div>
              <FormControlCustom
                error={form.errors.password}
                label="Password"
                value={form.fields.password}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateField("password", event.currentTarget.value)
                }
                type="password"
                rest={{ autoComplete: "new-password" }}
                required
              />
            </div>
            <div>
              <FormControlCustom
                error={form.errors.repeat_password}
                label="Repeat Password"
                value={form.fields.repeat_password}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  updateField("repeat_password", event.currentTarget.value)
                }
                type="password"
                rest={{ autoComplete: "new-password" }}
                required
              />
            </div>
          </>
        )}
      </div>
    </DialogCustom>
  );
};

export default AccountForm;
