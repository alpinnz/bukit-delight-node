import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import MenuForm from "./form";

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
    Menus: {
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
    type,
    error,
  }: {
    label: string;
    value?: string;
    onChange: (
      event: React.ChangeEvent<HTMLInputElement>,
      checked?: boolean,
    ) => void;
    type?: string;
    error?: string;
  }) => (
    <label>
      {label}
      <input
        aria-label={label}
        type={
          type === "file" ? "file" : type === "switch" ? "checkbox" : "text"
        }
        value={type === "file" || type === "switch" ? undefined : (value ?? "")}
        onChange={(event) => onChange(event, event.currentTarget.checked)}
      />
      {error && <span>{error}</span>}
    </label>
  ),
}));
vi.mock("../../../../components/hooks/use.validate", () => ({
  default: async (
    form: { fields: Record<string, unknown> },
    setForm: (update: unknown) => void,
    rules: Array<{ key: string; validate: string[] }>,
  ) => {
    const errors: Record<string, string> = {};
    for (const rule of rules) {
      const value = form.fields[rule.key];
      if (rule.validate.includes("required") && !value) {
        errors[rule.key] = "Cannot be empty";
      }
      if (
        rule.validate.includes("number") &&
        value !== undefined &&
        !`${value}`.match(/^[0-9]+$/)
      ) {
        errors[rule.key] = "Only numbers";
      }
    }
    setForm((current: { fields: Record<string, unknown> }) => ({
      ...current,
      errors,
    }));
    return Object.keys(errors).length === 0;
  },
}));

const stateFor = (dialog: Record<string, unknown>) => ({
  Menus: { loading: false },
  Categories: { data: [{ _id: "category-1", name: "Food" }] },
  Service: { form_dialog: dialog },
});

describe("MenuForm", () => {
  afterEach(cleanup);
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.reduxState = stateFor({ open: true, type: "create", row: {} });
  });

  it("validates required creation fields and dispatches a menu payload", async () => {
    render(<MenuForm />);
    fireEvent.click(screen.getByText("Submit"));
    expect(await screen.findAllByText("Cannot be empty")).toHaveLength(6);
    expect(mocks.onCreate).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("Name"), {
      target: { value: "Soup" },
    });
    fireEvent.change(screen.getByLabelText("Description"), {
      target: { value: "Hot soup" },
    });
    fireEvent.change(screen.getByLabelText("Price"), {
      target: { value: "120" },
    });
    fireEvent.change(screen.getByLabelText("Duration"), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText("Categories"), {
      target: { value: "category-1" },
    });
    const image = new File(["image"], "soup.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Image"), {
      target: { files: [image] },
    });
    fireEvent.click(screen.getByText("Submit"));

    await waitFor(() =>
      expect(mocks.onCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Soup",
          desc: "Hot soup",
          price: "120",
          duration: "10",
          id_category: "category-1",
          image,
        }),
      ),
    );
  });

  it("updates existing menu details without requiring an image", async () => {
    mocks.reduxState = stateFor({
      open: true,
      type: "update",
      row: {
        _id: "menu-1",
        name: "Soup",
        desc: "Hot soup",
        price: 120,
        duration: 10,
        id_category: { _id: "category-1" },
        isAvailable: true,
        isFavorite: false,
      },
    });
    render(<MenuForm />);
    fireEvent.click(screen.getByText("Submit"));
    await waitFor(() =>
      expect(mocks.onUpdate).toHaveBeenCalledWith(
        "menu-1",
        expect.objectContaining({
          name: "Soup",
          id_category: "category-1",
          price: "120",
          duration: "10",
        }),
      ),
    );
  });

  it("deletes the selected menu", () => {
    mocks.reduxState = stateFor({
      open: true,
      type: "delete",
      row: { _id: "menu-2", name: "Tea" },
    });
    render(<MenuForm />);
    fireEvent.click(screen.getByText("Submit"));
    expect(mocks.onDelete).toHaveBeenCalledWith("menu-2");
  });
});
