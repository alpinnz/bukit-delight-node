import type { ComponentProps } from "react";
import {
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
  Select,
  FormGroup,
  FormControlLabel,
  Switch,
  InputAdornment,
} from "@material-ui/core";

type FormControlCustomProps = {
  error?: string;
  value?: string | number | boolean;
  onChange?: (event: any, second?: any) => void;
  label: string;
  type?: string;
  required?: boolean;
  data?: Array<{ _id: string; name: string }>;
  rest?: ComponentProps<typeof OutlinedInput>;
};

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
  const key = `${label}`.toLowerCase();
  const isError = Boolean(error && error !== "");

  if (type === "switch") {
    return (
      <FormControl
        error={isError}
        component="fieldset"
        fullWidth
        margin="normal"
        variant="outlined"
      >
        <FormGroup aria-label="position" row>
          <FormControlLabel
            value="start"
            control={
              <Switch
                checked={Boolean(value)}
                onChange={onChange}
                name={`${key}`}
                color="primary"
              />
            }
            label={label}
            labelPlacement="start"
          />
        </FormGroup>
      </FormControl>
    );
  }

  return (
    <FormControl error={isError} fullWidth margin="normal" variant="outlined">
      {type !== "file" && <InputLabel htmlFor={key}>{label}</InputLabel>}

      {type === "select" && (
        <Select
          id={`${key}`}
          value={value || ""}
          onChange={onChange}
          label="Roles"
        >
          {data.map((entry) => (
            <MenuItem
              key={entry._id}
              selected={value === entry._id}
              value={entry._id}
            >
              {entry.name}
            </MenuItem>
          ))}
        </Select>
      )}
      {type === "file" && (
        <OutlinedInput
          type="file"
          inputProps={{ accept: "image/png, image/jpeg" }}
          onChange={onChange}
          fullWidth
          required
        />
      )}
      {type === "duration" && (
        <OutlinedInput
          id={`${key}`}
          value={value || "0"}
          onChange={onChange}
          label={label}
          fullWidth
          required={required || false}
          type="number"
          endAdornment={<InputAdornment position="end">Minute</InputAdornment>}
        />
      )}
      {type === "number" && (
        <OutlinedInput
          id={`${key}`}
          value={value || "0"}
          onChange={onChange}
          label={label}
          fullWidth
          required={required || false}
          type="number"
          {...rest}
        />
      )}
      {type !== "duration" &&
        type !== "file" &&
        type !== "select" &&
        type !== "number" && (
          <OutlinedInput
            id={`${key}`}
            value={value || ""}
            onChange={onChange}
            label={label}
            fullWidth
            required={required || false}
            type={type || "text"}
          />
        )}
      <FormHelperText id={`help-${key}`}>{error || ""}</FormHelperText>
    </FormControl>
  );
};

export default FormControlCustom;
