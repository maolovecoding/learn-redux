import { useLayoutEffect } from "react";
import { useState } from "react";
import { Router } from "react-router";
/**
 * 路由历史组件
 * @param {*} param0
 * @returns
 */
export const HistoryRouter = ({ history, children }) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });
  useLayoutEffect(() => {
    return history.listen(setState);
  }, [history]);
  return (
    <Router
      location={state.location}
      action={state.action}
      navigationType={state.action}
      navigator={history}
    >
      {children}
    </Router>
  );
};
