import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CategoryForm from "./form";

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
    Categories: {
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
    type,
    error,
  }: {
    label: string;
    value?: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    error?: string;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        type={type === "file" ? "file" : "text"}
        value={type === "file" ? undefined : (value ?? "")}
        onChange={onChange}
      />
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

describe("CategoryForm", () => {
  afterEach(cleanup);

  beforeEach(() => {
    vi.clearAllMocks();
    mocks.reduxState = {
      Categories: { loading: false },
      Service: { form_dialog: { open: true, type: "create", row: {} } },
    };
  });

  it("validates required fields and dispatches a create action", async () => {
    const { findByText } = render(<CategoryForm />);
    fireEvent.click(screen.getByText("Submit"));
    expect((await screen.findAllByText("Cannot be empty")).length).toBe(3);

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Drinks" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Cold drinks" },
    });
    const image = new File(["image"], "drink.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Image"), {
      target: { files: [image] },
    });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() => {
      expect(mocks.onCreate).toHaveBeenCalledWith({
        name: "Drinks",
        desc: "Cold drinks",
        image,
      });
    });
    expect(mocks.dispatch).toHaveBeenCalledWith({
      type: "create",
      fields: { name: "Drinks", desc: "Cold drinks", image },
    });
  });

  it("updates an existing category without requiring a new image", async () => {
    mocks.reduxState = {
      Categories: { loading: false },
      Service: {
        form_dialog: {
          open: true,
          type: "update",
          row: { id: "cat-1", name: "Drinks", desc: "Cold" },
        },
      },
    };
    render(<CategoryForm />);
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
      expect(mocks.onUpdate).toHaveBeenCalledWith("cat-1", {
        name: "Drinks",
        desc: "Cold",
      });
    });
  });

  it("dispatches delete for the selected category", () => {
    mocks.reduxState = {
      Categories: { loading: false },
      Service: {
        form_dialog: {
          open: true,
          type: "delete",
          row: { id: "cat-2", name: "Snacks" },
        },
      },
    };
    render(<CategoryForm />);
    fireEvent.click(screen.getByText("Submit"));
    expect(mocks.onDelete).toHaveBeenCalledWith("cat-2");
  });
});
