import type { Dispatch, SetStateAction } from "react";

type FormState = {
  fields: Record<string, unknown>;
  errors: Record<string, string>;
};
type ValidationRule = { key?: string; validate?: string[] };

const emailPattern = /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i;

const useValidate = async <State extends FormState>(
  state: State,
  setState: Dispatch<SetStateAction<State>>,
  rules: ValidationRule[] = [],
): Promise<boolean> => {
  const { fields } = state;
  const errors: Record<string, string> = {};
  let formIsValid = true;

  for (const rule of rules) {
    if (!rule.validate || !rule.key) continue;

    if (rule.validate.includes("required") && !fields[rule.key]) {
      formIsValid = false;
      errors[rule.key] = "Cannot be empty";
    }

    if (
      rule.validate.includes("number") &&
      typeof fields[rule.key] !== "undefined" &&
      !/^[0-9]+$/.test(String(fields[rule.key]))
    ) {
      formIsValid = false;
      errors[rule.key] = "Only numbers";
    }

    if (
      rule.validate.includes("email") &&
      typeof fields[rule.key] !== "undefined" &&
      !emailPattern.test(String(fields[rule.key]))
    ) {
      formIsValid = false;
      errors[rule.key] = "Email not valid";
    }

    if (rule.validate.includes("match-passowrd")) {
      const password = fields.password;
      const repeatedPassword = fields.repeat_password;
      if (
        typeof password !== "undefined" &&
        typeof repeatedPassword !== "undefined" &&
        password !== repeatedPassword
      ) {
        formIsValid = false;
        errors.password = "Password not match";
        errors.repeat_password = "Password not match";
      }
    }
  }

  setState({ ...state, errors });
  return formIsValid;
};

export default useValidate;
