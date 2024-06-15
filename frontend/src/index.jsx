import "bootstrap/dist/css/bootstrap.min.css";
import React, { lazy } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import ReduxPromise from "redux-promise";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { rootReducer, initialState } from "./redux/reducers";
import { createBrowserHistory } from "history";
import App from './App'

const root = ReactDOM.createRoot(document.getElementById("root"));
const middlewares = applyMiddleware(logger, ReduxPromise);
const store = createStore(rootReducer, initialState, middlewares);
const history = createBrowserHistory();

root.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <Routes>
      <Route path="/react/app" element={<App />} />
        {/* <Route
          path="/projects/:project_id/obs_app/obs_index"
          element={<ObsPage />}
        />
        <Route
          path="/projects/:project_id/insp_app/insp"
          element={<InspectionList />}
        />
        <Route
          path="/projects/:project_id/insp_app/insp/:insp_id/pdf"
          element={<InspectionOpenPDF />}
        />
        <Route
          path="/projects/:project_id/insp_app/insp/:insp_id/edit"
          element={<InspectionEdit function='edit' />}
        /> */}
      </Routes>
    </BrowserRouter>
  </Provider>
);
