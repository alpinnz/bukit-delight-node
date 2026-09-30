import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import TableForm from "./form";

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
    Tables: {
      onCreate: mocks.onCreate,
      onUpdate: mocks.onUpdate,
      onDelete: mocks.onDelete,
    },
    Service: { hideFormDialog: mocks.hideFormDialog },
  },
}));
vi.mock("../../../../components/molecules/alert-dialog", () => ({
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
vi.mock("../../../../components/molecules/form-control", () => ({
  default: ({
    label,
    value,
    onChange,
    error,
  }: {
    label: string;
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
  }) => (
    <label>
      {label}
      <input aria-label={label} value={value ?? ""} onChange={onChange} />
      {error && <span>{error}</span>}
    </label>
  ),
}));
vi.mock("../../../../hooks/use-validate", () => ({
  default: async (
    form: { fields: Record<string, unknown> },
    setForm: (update: unknown) => void,
    requiredFields: Array<{ key: string }>,
  ) => {
    const errors = Object.fromEntries(
      requiredFields
        .filter(({ key }) => !form.fields[key])
        .map(({ key }) => [key, "Cannot be empty"]),
    );
    setForm((current: { fields: Record<string, unknown> }) => ({
      ...current,
      errors,
    }));
    return Object.keys(errors).length === 0;
  },
}));

describe("TableForm", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.reduxState = {
      Tables: { loading: false },
      Service: { form_dialog: { open: true, type: "create", row: {} } },
    };
  });

  it("requires a table name before creating", async () => {
    render(<TableForm />);
    fireEvent.click(screen.getByText("Submit"));
    expect(await screen.findByText("Cannot be empty")).toBeDefined();
    expect(mocks.onCreate).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("name"), {
      target: { value: "A1" },
    });
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() =>
      expect(mocks.onCreate).toHaveBeenCalledWith({ name: "A1" }),
    );
  });

  it("updates and deletes the selected table", async () => {
    mocks.reduxState = {
      Tables: { loading: false },
      Service: {
        form_dialog: {
          open: true,
          type: "update",
          row: { id: "table-1", name: "A1" },
        },
      },
    };
    const { rerender } = render(<TableForm />);
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() =>
      expect(mocks.onUpdate).toHaveBeenCalledWith("table-1", { name: "A1" }),
    );

    mocks.reduxState = {
      Tables: { loading: false },
      Service: {
        form_dialog: {
          open: true,
          type: "delete",
          row: { id: "table-1", name: "A1" },
        },
      },
    };
    rerender(<TableForm />);
    fireEvent.click(screen.getByText("Submit"));
    expect(mocks.onDelete).toHaveBeenCalledWith("table-1");
  });
});
