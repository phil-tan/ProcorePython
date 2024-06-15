import React from "react";
import { connect } from "react-redux";
import withRouter from "../shared/withRouter";
import { bindActionCreators } from "redux";
import { fetchInspection, fetchAlbums, fetchPhotos } from "../redux/actions/insp_actions"
import { useState, useEffect } from "react";
import InspReportTemplate from "./InspReportTemplate";
import { PDFViewer } from "@react-pdf/renderer";

// Font.register({ family: 'Helvetica' });
// Create styles
const InspectionOpenPDF = (props) => {
  useEffect(() => {
    props.fetchInspection(props.params.project_id, props.params.insp_id);
  }, []);

  return (
    <div>
      {/* <div><a href={`/projects/${props.params.project_id}/insp_app/insp`}>Back to List</a></div> */}
      <div>
        <a href={`/projects/${props.params.project_id}/insp_app/insp`}>
          Back to List
        </a>
      </div>
      <div>
        {/* {props.inspection.name ? <PDFDownloadLink document={<InspReportTemplate
                    inspection={props.inspection}/>} fileName="download.pdf">
      {({ blob, url, loading, error }) =>
        loading ? 'Loading document...' : 'Download PDF!'
      }
    </PDFDownloadLink> : <></>} */}
      </div>
      <div>
        {props.inspection.name ? (
          <PDFViewer width="100%" height="1800px">
            <InspReportTemplate inspection={props.inspection} />
          </PDFViewer>
        ) : (
          <>{"PDF Loading..."}</>
        )}
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    inspection: state.inspection,
    albums: state.albums,
    photos: state.photos,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchInspection, fetchAlbums, fetchPhotos },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InspectionOpenPDF)
);
