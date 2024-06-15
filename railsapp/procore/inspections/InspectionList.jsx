import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchInspList, setLoading } from "../redux/actions/insp_actions"
import { useState, useEffect } from "react";
import withRouter from "../shared/withRouter";
import InspectionsTable from "./InspectionsTable";
import InspectionShow from "./InspectionShow";
import { useNavigate } from "react-router-dom";
import { Summary } from "./Summary";

const InspectionsList = (props) => {
  const navigate = useNavigate();

  const inspection_types = [
    { name: "design", label: "Design" },
    { name: "document_review", label: "Document Review" },
    { name: "site_inspection", label: "Site Inspection" },
    { name: "commissioning", label: "Commissioning" },
    { name: "other", label: "Other" },
  ];

  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState("table_view");

  useEffect(() => {
    props.setLoading(true);
    props.fetchInspList(props.params.project_id);
  }, []);

  const handleOnClick = (e) => {
    setActiveTab(e.target.id);
    console.log(e.target.id);
    console.log(activeTab);
  };

  const handleViewClick = (e) => {
    setView(e.target.id);
    console.log(e.target.id);
  };

  const InspList = (props) => {
    if (view === "table_view") {
      return (
        <InspectionsTable
          inspections={props.inspections}
          type={activeTab}
          project_id={props.project_id}
        />
      );
    // } else if (view === "summary_view") {
    //   return <Summary inspections={props.inspections} type={activeTab} />;
    } else {
      return <></>;
    }
  };

  return (
    <div style={{ width: "90vw", margin: "auto" }}>
      <nav className="nav nav-pills mt-1">
        <a className={`nav-link active`} type="button">
          Inspections
        </a>
        <a
          className={`nav-link`}
          target="_blank"
          type="button"
          href={`/projects/${props.params.project_id}/obs_app/obs_index`}
        >
          Observations
        </a>
      </nav>
      <br></br>
      <h3>{`Inspections - ${JSON.parse(document.getElementById('app').dataset.project).name}`}</h3>
      <hr></hr>
      {props.loading ? (
        <>{"Loading..."} </>
      ) : (
        <div className="row">
          <div className="col-3">
            <nav
              className="nav flex-column nav-pills bg-dark rounded"
              id="nav-tab"
              role="tablist"
            >
              <a
                className={`text-left text-light nav-link ${
                  activeTab === "all" ? "active" : ""
                }`}
                id="all"
                onClick={handleOnClick}
                type="button"
                role="tab"
              >{`All (${props.inspections.length})`}</a>
              {inspection_types.map((insp_type) => {
                const count = props.inspections.filter(
                  (insp) => insp.inspection_type.name === insp_type.label
                ).length;
                return (
                  <a
                    className={`text-left text-light nav-link ${
                      insp_type.label === activeTab ? "active" : ""
                    }`}
                    id={insp_type.label}
                    onClick={handleOnClick}
                    type="button"
                    role="tab"
                  >
                    {`${insp_type.label} (${count})`}
                  </a>
                );
              })}
            </nav>
          </div>
          <div className="col-9 rounded">
            {/* <nav className="nav nav-pills">
              <a
                className={`nav-link ${view === "table_view" ? "active" : ""}`}
                id="table_view"
                onClick={handleViewClick}
                type="button"
              >
                Table View
              </a>
              <a
                className={`nav-link ${
                  view === "summary_view" ? "active" : ""
                }`}
                id="summary_view"
                onClick={handleViewClick}
                type="button"
              >
                Summary View
              </a>
            </nav> */}
            <br></br>
            <div className="tab-content" id="nav-tabContent">
              <InspList
                inspections={props.inspections}
                project_id={props.params.project_id}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function mapStateToProps(state) {
  return {
    inspections: state.inspections,
    loading: state.insp_loading,
    project: state.project,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchInspList, setLoading }, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InspectionsList)
);
