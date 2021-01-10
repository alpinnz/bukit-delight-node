const useValidate = async (state, setState, data = []) => {
  let fields = state.fields;
  let errors = {};
  let formIsValid = true;

  const required = (key) => {
    if (!fields[key]) {
      formIsValid = false;
      errors[key] = "Cannot be empty";
    }
  };

  const number = (key) => {
    if (typeof fields[key] !== "undefined") {
      if (!`${fields[key]}`.match(/^[0-9]+$/)) {
        formIsValid = false;
        errors[key] = "Only numbers";
      }
    }
  };

  const email = (key) => {
    if (typeof fields[key] !== "undefined") {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(fields[key])) {
        formIsValid = false;
        errors[key] = "Email not valid";
      }
    }
  };

  const match = (key1, key2) => {
    if (
      typeof fields[key1] !== "undefined" &&
      typeof fields[key2] !== "undefined"
    ) {
      if (fields[key1] !== fields[key2]) {
        formIsValid = false;
        errors[key1] = "Password not match";
        errors[key2] = "Password not match";
      }
    }
  };

  for (let i = 0; i < data.length; i++) {
    if (data[i]["validate"] && data[i]["key"]) {
      const validate = data[i]["validate"];
      const key = data[i]["key"];

      if (validate.includes("required")) {
        required(key);
      }
      if (validate.includes("number")) {
        number(key);
      }
      if (validate.includes("email")) {
        email(key);
      }
      if (validate.includes("match-passowrd")) {
        match("password", "repeat_password");
      }
    }
  }
  setState({ ...state, errors: errors });
  return formIsValid;
};

export default useValidate;
