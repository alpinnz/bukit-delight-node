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

const FormControlCustom = (props) => {
  const {
    error,
    value,
    onChange,
    label,
    type,
    required,
    data = [],
    rest,
  } = props;
  const key = `${label}`.toLowerCase();

  const isError = error && error !== "" ? true : false;

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
                checked={value || ""}
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
      {type !== "file" && (
        <InputLabel htmlFor={`label-${key}`}>{label}</InputLabel>
      )}

      {type === "select" && (
        <Select
          id={`${key}`}
          value={value || ""}
          onChange={onChange}
          label="Roles"
        >
          {data.map((e) => {
            return (
              <MenuItem
                key={e}
                selected={value === e["_id"] ? true : false}
                value={e["_id"]}
              >
                {e["name"]}
              </MenuItem>
            );
          })}
        </Select>
      )}
      {type === "file" && (
        <OutlinedInput
          type="file"
          accept="image/png, image/jpeg"
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
          InputLabelProps={{ shrink: false }}
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
