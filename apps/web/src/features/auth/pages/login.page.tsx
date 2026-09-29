import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import ContainerCustom from "../../../components/common/container.custom";
import ButtonCustom from "../../../components/common/button.custom";
import FormControlCustom from "../../../components/common/form.control.custom";
import TextCustom from "../../../components/common/text.custom";
import Copyright from "../../../components/templates/copyright";
import Validate from "../../../components/hooks/use.validate";
import Actions from "../../../actions";
import type { AppDispatch } from "../../../store";
import type { LoginCredentials } from "../authentication.action";

type LoginFormState = {
  fields: LoginCredentials;
  errors: Record<string, string>;
};

type LoginReduxState = {
  Authentication: {
    account: { role: string } | null;
    loading: boolean;
  };
};

const LoginPage = () => {
  const [state, setState] = useState<LoginFormState>({
    fields: { username: "", password: "" },
    errors: {},
  });
  const account = useSelector(
    (state: LoginReduxState) => state.Authentication.account,
  );
  const loading = useSelector(
    (state: LoginReduxState) => state.Authentication.loading,
  );
  const dispatch = useDispatch<AppDispatch>();

  if (account) {
    const role = `${account.role}`.toLocaleLowerCase();
    if (role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (role === "cashier") {
      return <Navigate to="/cashier/home" replace />;
    }
  }

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setState({ ...state, fields: { ...state.fields, [field]: value } });
  };

  const onSubmit = async () => {
    const formSet = [
      {
        key: "username",
        validate: ["required"],
      },
      {
        key: "password",
        validate: ["required"],
      },
    ];
    const validate = await Validate(state, setState, formSet);
    if (validate) {
      dispatch(Actions.Authentication.onLogin(state.fields));
    }
  };

  return (
    <ContainerCustom title="Login" maxWidth="xs">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex w-full max-w-sm flex-col items-center justify-center">
          <TextCustom component="h1" variant="h5">
            Login
          </TextCustom>
          <div>
            <FormControlCustom
              error={state.errors["username"]}
              label="Username"
              value={state.fields["username"]}
              onChange={(e) => handleChange("username", e.target.value)}
              type="text"
              required
            />

            <FormControlCustom
              error={state.errors["password"]}
              label="Password"
              value={state.fields["password"]}
              onChange={(e) => handleChange("password", e.target.value)}
              type="password"
              required
            />

            <ButtonCustom
              label="Login"
              disabled={loading}
              loading={loading}
              onClick={() => onSubmit()}
              fullWidth
            />
          </div>
        </div>
        <div className="mt-8">
          <Copyright />
        </div>
      </div>
    </ContainerCustom>
  );
};

export default LoginPage;
