import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FormControl from "./form-control";

describe("FormControl", () => {
  it("associates the field label with its text input", () => {
    render(
      <FormControl label="Name" value="" onChange={() => undefined} />,
    );

    expect(screen.getByLabelText("Name")).toBeDefined();
  });

  it("keeps the switch state controlled and forwards changes", () => {
    const onChange = vi.fn();
    render(
      <FormControl
        label="Available"
        type="switch"
        value={true}
        onChange={onChange}
      />,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Available" });
    expect((checkbox as HTMLInputElement).checked).toBe(true);
    fireEvent.click(checkbox);
    expect(onChange).toHaveBeenCalledOnce();
  });
});
