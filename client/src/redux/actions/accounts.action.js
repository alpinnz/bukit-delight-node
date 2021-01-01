const UPDATE = (accounts) => {
  return {
    type: "Accounts/UPDATE",
    payload: accounts,
  };
};

const AccountsAction = {
  UPDATE,
};
export default AccountsAction;
