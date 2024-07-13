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
import AllProjects from "./projects/AllProjects";
import ProjectPage from "./projects/ProjectPage";
import IssuesPage from "./issues/IssuesPage";
import ActivitiesListTable from "./activities/ActivitiesListTable";

const root = ReactDOM.createRoot(document.getElementById("root"));
const middlewares = applyMiddleware(logger, ReduxPromise);
const store = createStore(rootReducer, initialState, middlewares);
const history = createBrowserHistory();

root.render(
  <Provider store={store}>
    <BrowserRouter history={history}>
      <Routes>
      <Route path="/app" element={<App />} />
      <Route path="/app/projects" element={<AllProjects />} />
      <Route path="/app/projects/:project_id/activities" element={<ActivitiesListTable/>}/>
      <Route path="/app/projects/:project_id/issues" element={<IssuesPage />}
        />
        {/*<Route
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
