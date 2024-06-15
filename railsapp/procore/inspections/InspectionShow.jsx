import React, { useState } from "react";
import { connect } from "react-redux";
import withRouter from "../shared/withRouter";
import { bindActionCreators } from "redux";
import { fetchInspection, fetchAlbums, fetchPhotos } from "../redux/actions/insp_actions"
import { useEffect } from "react";
import CSILogoHeader from "../../../assets/images/CSILogoHeader.png";
import PrintButton from "./PrintButton";
import { shorten_url } from "../../functions/functions";

const InspectionShow = (props) => {
  useEffect(() => {
    props.fetchInspection(props.params.project_id, props.params.insp_id);
  }, []);

  useEffect(() => {
    const album = props.albums.find(
      (album) => album.name === props.inspection.album
    );
    if (album) {
      console.log(album);
      props.fetchPhotos(props.params.project_id, album.id);
    }
  }, [props.inspection, props.albums]);

  return (
    <div className="inspection-outer">
      <a href={`/projects/${props.params.project_id}/insp_app/insp`}>
        Back to List
      </a>
      <div className="text-end">
        {" "}
        <PrintButton />
      </div>
      <div id="inspection-paper">
        <div id="inspection-show">
          <div>
            <img src={CSILogoHeader} style={{ height: "75px" }} />
          </div>
          <div>
            <h2>{props.inspection.name}</h2>
          </div>
          <div>
            <table className="table insp-header">
              <tr>
                <th>Project</th>
                <td>Example Project</td>
              </tr>
              <tr>
                <th>Subject</th>
                <td>{props.inspection.description}</td>
              </tr>
              <tr>
                <th>Date</th>
                <td>{props.inspection.inspection_date}</td>
              </tr>
            </table>
          </div>
          <h3>Summary</h3>
          <div
            className="text-justify"
            dangerouslySetInnerHTML={{ __html: props.inspection.summary }}
          ></div>

          <h3>Summary</h3>
          <div className="text-justify">{props.inspection.summary}</div>

          <h5>Attachments</h5>
          <br></br>

          <h5>Photos</h5>
          <table className="insp-photos">
            <tbody>
              {props.photos.map((att) => {
                return (
                  <tr className="insp-photo-row" key={att.id}>
                    <td className="insp-img-cell insp-table-cell">
                      <img
                        className="insp-img"
                        src={att.url}
                        alt={att.filename}
                      />
                    </td>
                    <td className="insp-desc-cell insp-table-cell">
                      <p>
                        <strong>Description: </strong>
                        {att.description}
                      </p>
                      <p>
                        <strong>Filename: </strong>
                        <a href={att.url} target="_blank">
                          {shorten_url(att.filename)}
                        </a>
                      </p>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
  connect(mapStateToProps, mapDispatchToProps)(InspectionShow)
);
