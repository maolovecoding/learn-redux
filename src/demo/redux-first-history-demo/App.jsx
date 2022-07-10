import { Route, Link, Routes } from "react-router-dom";
import { HistoryRouter } from "../../redux-first-history/rr6";
import { Provider } from "react-redux";
import { store, history } from "../../store-connected";
import Home from "./Home";
import Counter from "./Counter";
const App = () => {
  return (
    <Provider store={store}>
      <HistoryRouter history={history}>
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
      </HistoryRouter>
    </Provider>
  );
};

export default App;
