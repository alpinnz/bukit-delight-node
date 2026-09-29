import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ContainerCustom from "../../../../components/common/container.custom";
import ButtonCustom from "../../../../components/common/button.custom";
import FormControlCustom from "../../../../components/common/form.control.custom";
import TextCustom from "../../../../components/common/text.custom";
import Copyright from "../../../../components/templates/copyright";
import Validate from "../../../../components/hooks/use.validate";
import Actions from "../../../../actions";
import type { AppDispatch } from "../../../../store";

type CustomerFormState = {
  fields: Record<string, string>;
  errors: Record<string, string>;
};

type CustomerFormReduxState = {
  Customers: { loading: boolean };
  Tables: { data: Array<{ name: string }> };
};

type CustomerFormProps = {
  username?: boolean;
  table?: boolean;
};

const Form = ({ username, table }: CustomerFormProps) => {
  const [state, setState] = useState<CustomerFormState>({
    fields: {},
    errors: {},
  });
  const Customers = useSelector(
    (state: CustomerFormReduxState) => state.Customers,
  );
  const Tables = useSelector((state: CustomerFormReduxState) => state.Tables);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleChange = (field: string, value: string) => {
    setState({ ...state, fields: { ...state.fields, [field]: value } });
  };

  const onSubmit = async () => {
    const formSet = [
      {
        key: "username",
        validate: [username ? "required" : ""],
      },
      {
        key: "table",
        validate: [table ? "required" : ""],
      },
    ];
    const validate = await Validate(state, setState, formSet);

    if (validate) {
      if (username && table) {
        const table = Tables.data.find((e) => e["name"] === state.fields.table);
        if (table) {
          dispatch(Actions.Customers.onCreate(state.fields));
          // dispatch(Actions.Customers.setCustomer(state.fields.customer));
          // dispatch(Actions.Tables.setTable(state.fields.table));
          navigate(`/customer/init/${table.name}`);
        } else {
          dispatch(Actions.Service.pushInfoNotification("Table not found"));
        }
      } else if (username && !table) {
        dispatch(Actions.Customers.onCreate(state.fields));
      } else if (table && !username) {
        const table = Tables.data.find((e) => e["name"] === state.fields.table);
        if (table) {
          // dispatch(Actions.Tables.setTable(state.fields.table));
          navigate(`/customer/init/${table.name}`);
        } else {
          dispatch(Actions.Service.pushInfoNotification("Table not found"));
        }
      }
    }
  };

  return (
    <ContainerCustom title="Customer" maxWidth="xs">
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="w-full">
          <div className="flex flex-col items-center justify-center">
            <TextCustom component="h1" variant="h5">
              Customer
            </TextCustom>
            <div>
              {username && (
                <FormControlCustom
                  error={state.errors["username"]}
                  label="Username"
                  value={state.fields["username"]}
                  onChange={(e) => handleChange("username", e.target.value)}
                  type="text"
                  required
                />
              )}
              {table && (
                <FormControlCustom
                  error={state.errors["table"]}
                  label="Table"
                  value={state.fields["table"]}
                  onChange={(e) => handleChange("table", e.target.value)}
                  type="text"
                  required
                />
              )}

              <ButtonCustom
                label="Submit"
                disabled={Customers.loading}
                loading={Customers.loading}
                onClick={onSubmit}
                fullWidth
              />
            </div>
          </div>
          <div className="mt-8">
            <Copyright />
          </div>
        </div>
      </div>
    </ContainerCustom>
  );
};

export default Form;
