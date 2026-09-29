import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AccountForm from "./form";

const mocks = vi.hoisted(() => ({
  dispatch: vi.fn(),
  reduxState: {} as Record<string, unknown>,
  onCreate: vi.fn((fields) => ({ type: "create", fields })),
  onUpdate: vi.fn((id, fields) => ({ type: "update", id, fields })),
  onDelete: vi.fn((id) => ({ type: "delete", id })),
  hideFormDialog: vi.fn(() => ({ type: "hide" })),
}));

vi.mock("react-redux", () => ({
  useDispatch: () => mocks.dispatch,
  useSelector: (selector: (state: unknown) => unknown) =>
    selector(mocks.reduxState),
}));
vi.mock("../../../../actions", () => ({
  default: {
    Users: {
      onCreate: mocks.onCreate,
      onUpdate: mocks.onUpdate,
      onDelete: mocks.onDelete,
    },
    Service: { hideFormDialog: mocks.hideFormDialog },
  },
}));
vi.mock("../../../../components/common/dialog.custom", () => ({
  default: ({
    children,
    onSubmit,
    title,
  }: {
    children: React.ReactNode;
    onSubmit: () => void;
    title: string;
  }) => (
    <section>
      <h1>{title}</h1>
      {children}
      <button onClick={onSubmit}>Submit</button>
    </section>
  ),
}));
vi.mock("../../../../components/common/form.control.custom", () => ({
  default: ({
    label,
    value,
    onChange,
    error,
    data,
    multiple,
  }: {
    label: string;
    value?: string | string[];
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    error?: string;
    data?: Array<{ _id: string; name: string }>;
    multiple?: boolean;
  }) => (
    <label>
      {label}
      {multiple ? (
        <select
          aria-label={label}
          multiple
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
        >
          {data?.map((role) => (
            <option key={role._id} value={role._id}>
              {role.name}
            </option>
          ))}
        </select>
      ) : (
        <input
          aria-label={label}
          value={Array.isArray(value) ? value.join(",") : (value ?? "")}
          onChange={onChange}
        />
      )}
      {error && <span>{error}</span>}
    </label>
  ),
}));
vi.mock("../../../../components/hooks/use.validate", () => ({
  default: async (
    form: { fields: Record<string, string> },
    setForm: (update: unknown) => void,
    rules: Array<{ key: string; validate: string[] }>,
  ) => {
    const errors: Record<string, string> = {};
    for (const rule of rules) {
      if (rule.validate.includes("required") && !form.fields[rule.key]) {
        errors[rule.key] = "Cannot be empty";
      }
      if (
        rule.validate.includes("email") &&
        form.fields[rule.key] &&
        !String(form.fields[rule.key]).includes("@")
      ) {
        errors[rule.key] = "Email not valid";
      }
    }
    if (
      rules.some((rule) => rule.validate.includes("match-passowrd")) &&
      form.fields.password !== form.fields.repeat_password
    ) {
      errors.password = "Password not match";
      errors.repeat_password = "Password not match";
    }
    setForm((current: { fields: Record<string, string> }) => ({
      ...current,
      errors,
    }));
    return Object.keys(errors).length === 0;
  },
}));

const createState = () => ({
  Users: { loading: false },
  Roles: { data: [{ _id: "role-1", name: "Cashier" }] },
  Service: { form_dialog: { open: true, type: "create", row: {} } },
});

describe("AccountForm", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.reduxState = createState();
  });

  it("requires matching passwords before creating an account", async () => {
    render(<AccountForm />);
    fireEvent.change(screen.getByLabelText("Username"), {
      target: { value: "operator" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "operator@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Roles"), {
      target: { value: "role-1" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "secret-1" },
    });
    fireEvent.change(screen.getByLabelText("Repeat Password"), {
      target: { value: "secret-2" },
    });
    fireEvent.click(screen.getByText("Submit"));

    expect(await screen.findAllByText("Password not match")).toHaveLength(2);
    expect(mocks.onCreate).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Repeat Password"), {
      target: { value: "secret-1" },
    });
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() =>
      expect(mocks.onCreate).toHaveBeenCalledWith({
        username: "operator",
        email: "operator@example.com",
        id_roles: ["role-1"],
        password: "secret-1",
        repeat_password: "secret-1",
      }),
    );
  });

  it("loads the current role and updates without password fields", async () => {
    mocks.reduxState = {
      Users: { loading: false },
      Roles: { data: [{ _id: "role-1", name: "Cashier" }] },
      Service: {
        form_dialog: {
          open: true,
          type: "update",
          row: {
            _id: "account-1",
            username: "operator",
            email: "operator@example.com",
            id_roles: [{ _id: "role-1" }],
          },
        },
      },
    };
    render(<AccountForm />);
    expect(
      (screen.getByLabelText("Roles") as HTMLSelectElement).selectedOptions[0]
        .value,
    ).toBe("role-1");
    expect(screen.queryByLabelText("Password")).toBeNull();
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() =>
      expect(mocks.onUpdate).toHaveBeenCalledWith("account-1", {
        username: "operator",
        email: "operator@example.com",
        id_roles: ["role-1"],
      }),
    );
  });

  it("deletes the selected account", () => {
    mocks.reduxState = {
      Users: { loading: false },
      Roles: { data: [] },
      Service: {
        form_dialog: {
          open: true,
          type: "delete",
          row: { _id: "account-2", username: "cashier" },
        },
      },
    };
    render(<AccountForm />);
    fireEvent.click(screen.getByText("Submit"));
    expect(mocks.onDelete).toHaveBeenCalledWith("account-2");
  });
});
