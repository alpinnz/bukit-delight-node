const LOGIN = (account) => {
  return {
    type: "Authentication/LOGIN",
    payload: account,
  };
};

const LOGOUT = () => {
  return {
    type: "Authentication/LOGOUT",
  };
};

const AuthenticationAction = { LOGIN, LOGOUT };
export default AuthenticationAction;
