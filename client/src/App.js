import useNetwork from "./components/hooks/use.network";
import Routes from "./routes";
import { Provider } from "react-redux";
import Store from "./store";

const NetworkStatusView = () => {
  const isNetwork = useNetwork();

  return (
    <div>
      {!isNetwork && (
        <div className="internet-error">
          <p>Internet connection lost</p>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <div>
      <Provider store={Store}>
        <NetworkStatusView />
        <Routes />
      </Provider>
    </div>
  );
};

export default App;
