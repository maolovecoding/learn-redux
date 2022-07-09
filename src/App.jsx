import { Route, Link, Router, Routes, BrowserRouter } from "react-router-dom";
import { ConnectedRouter } from "connected-react-router";
import { Provider } from "react-redux";
import store from "./store-connected";
import history from "./history";
import Home from "./Home";
import Counter from "./Counter";
const App = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/counter">Counter</Link>
          </li>
        </ul>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/counter" element={<Counter />}></Route>
        </Routes>
      </ConnectedRouter>
    </Provider>
  );
};

export default App;
