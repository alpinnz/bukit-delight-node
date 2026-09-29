import type { ChangeEvent, InputHTMLAttributes } from "react";

type FormControlCustomProps = {
  error?: string;
  value?: string | number | boolean;
  onChange?: {
    bivarianceHack(
      event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      checked?: boolean,
    ): void;
  }["bivarianceHack"];
  label: string;
  type?: string;
  required?: boolean;
  data?: Array<{ _id: string; name: string }>;
  rest?: InputHTMLAttributes<HTMLInputElement>;
};

const controlClass =
  "mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

const FormControlCustom = ({
  error,
  value,
  onChange,
  label,
  type,
  required,
  data = [],
  rest,
}: FormControlCustomProps) => {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${id}-error`;

  if (type === "switch") {
    return (
      <label className="my-3 flex items-center justify-between gap-4 text-sm font-medium text-slate-700">
        {label}
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange?.(event, event.currentTarget.checked)}
          name={id}
          aria-describedby={error ? errorId : undefined}
          className="size-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
      </label>
    );
  }

  return (
    <div className="my-3 w-full">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
        {required ? " *" : ""}
      </label>
      {type === "select" ? (
        <select
          id={id}
          value={typeof value === "boolean" ? String(value) : (value ?? "")}
          onChange={onChange}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={controlClass}
        >
          <option value="">Select {label}</option>
          {data.map((entry) => (
            <option key={entry._id} value={entry._id}>
              {entry.name}
            </option>
          ))}
        </select>
      ) : type === "file" ? (
        <input
          id={id}
          type="file"
          accept="image/png, image/jpeg"
          onChange={onChange}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={controlClass}
        />
      ) : (
        <div className="flex items-center gap-2">
          <input
            id={id}
            value={
              typeof value === "boolean"
                ? String(value)
                : (value ??
                  (type === "duration" || type === "number" ? "0" : ""))
            }
            onChange={onChange}
            required={required}
            type={type === "duration" ? "number" : (type ?? "text")}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            className={controlClass}
            {...rest}
          />
          {type === "duration" && (
            <span className="text-sm text-slate-500">Minute</span>
          )}
        </div>
      )}
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormControlCustom;
