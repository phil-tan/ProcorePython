import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import withRouter from "../../shared/withRouter";
import { useEffect } from "react";
import Table from "./Table";
import FilterForm from "../toolbar/FilterForm";
import ColumnCheckBoxForm from "../toolbar/ColumnCheckBoxForm";
import ObsPDFDownloadLink from "./ObsPDFDownloadLink";
import { fetchObsList } from "../../redux/actions/obs_actions";
import { fetchInspList } from "../../redux/actions/insp_actions";
import LoadingSpinner from "../../shared/LoadingSpinner";
import EditForm from "./EditForm";



const ObsPage = (props) => {
  const project_id = props.params.project_id;
  useEffect(() => {
    // props.setLoading(true);
    props.fetchObsList(project_id, null);
    props.fetchInspList(project_id)
  }, []);

  return (
    <div className="obs-page">
      <nav className="nav nav-pills mt-1">
        <a
          className={`nav-link`}
          type="button"
          href={`/projects/${props.params.project_id}/insp_app/insp`}
        >
          Inspections
        </a>
        <a className={`nav-link active`} target="_blank" type="button">
          Observations
        </a>
      </nav>
          <div className="text-end mb-2">
            <ObsPDFDownloadLink />
          </div>
          <div className="toolbar row gx-1 mb-2">
            <div className="col-3">
              <ColumnCheckBoxForm columns={props.obs_columns} />
            </div>
            <div className="col-9">
              <FilterForm
                columns={props.obs_columns.filter((col) => col.filterable)}
              />
            </div>
          </div>
          {/* cREATE fORM */}
          <div className="d-flex justify-content-end">
            {props.create_loading ? <span>Creating Item...<span className="spinner-grow text-primary"></span></span> : <></>}
            <span>
              {/* <EditForm
                text=<button
                  className="btn btn-md"
                  style={{ color: "white", backgroundColor: "orangered" }}
                >
                  Add Item
                </button>
                obs={{}}
                function="add"
              /> */}
            </span>
          </div>
          <div id="obs-log" style={{ printColorAdjust: "exact" }}>
            <h3>
              <strong>{`${
                JSON.parse(document.getElementById("app").dataset.project)
                  .name
              } - Issues Log`}</strong>
            </h3>
            <p>
              <strong>Date Printed: </strong>
              {`${new Date()}`}
            </p>
            {props.obs_loading ? (
              <LoadingSpinner />
            ) : (
              <Table columns={props.obs_columns.filter((col) => col.show)} />
            )}
          </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    observations: state.observations,
    obs_columns: state.obs_columns,
    obs_loading: state.obs_loading,
    create_loading: state.create_loading
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchObsList, fetchInspList }, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ObsPage)
);
