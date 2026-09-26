import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FormControlCustom from "./form.control.custom";

describe("FormControlCustom", () => {
  it("associates the field label with its text input", () => {
    render(
      <FormControlCustom label="Name" value="" onChange={() => undefined} />,
    );

    expect(screen.getByLabelText("Name")).toBeDefined();
  });

  it("keeps the switch state controlled and forwards changes", () => {
    const onChange = vi.fn();
    render(
      <FormControlCustom
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
