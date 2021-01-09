import {
  OutlinedInput,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
  Select,
} from "@material-ui/core";

const FormControlCustom = (props) => {
  const { error, value, onChange, label, type, required, data = [] } = props;
  const key = `${label}`.toLowerCase();

  const isError = error && error !== "" ? true : false;
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

      {type !== "file" && type !== "select" && (
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
