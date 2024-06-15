import React from "react";
import InspPDFDownloadLink from "./InspPDFDownloadLink";
import PDFIcon from "../../../assets/images/pdf-icon.png";
import FileDownloadIcon from "../../../assets/images/file-download-icon.png";
import FilesDownloadIcon from "../../../assets/images/files-download-icon.png";
import withRouter from "../shared/withRouter";


const InspectionsTable = (props) => {
  const inspections =
    props.type === "all"
      ? props.inspections
      : props.inspections.filter(
          (insp) => insp.inspection_type.name === props.type
        );

  return (
    <>
      {inspections.length > 0 ? (
        <table className="table table-striped">
          <thead className="table-dark bg-dark" style={{ padding: "2px" }}>
            <th>Date</th>
            <th>Description</th>
            <th>Trade</th>
            <th>Template</th>
            <th>PDF Options</th>
          </thead>
          <tbody>
            {Object.keys(inspections).length > 0 ? (
              inspections.map((insp) => (
                <tr>
                  <td>{insp["inspection_date"]}</td>
                  <td>
                  <a
                      href={`/projects/${props.params.project_id}/insp_app/insp/${insp.id}/edit`}
                      ><strong>{insp["description"]}</strong></a>
                  </td>
                  <td>{insp.trade ? insp.trade.name : ""}</td>
                  <td>
                    {insp["list_template_name"]}
                  </td>
                  <td>
                    <a
                      target="_blank"
                      title="Open PDF"
                      href={`/projects/${props.project_id}/insp_app/insp/${insp.id}/pdf`}
                      className="btn btn-sm"
                    >
                      <img src={PDFIcon} style={{ height: "30px" }}></img>
                    </a>
                    <InspPDFDownloadLink
                      inspection_id={insp.id}
                      button_label=<img src={FileDownloadIcon} style={{ height: "30px" }}></img>
                      btn_class = ''
                      print_attachments={false}
                    />
                    <InspPDFDownloadLink
                      inspection_id={insp.id}
                      button_label=<img src={FilesDownloadIcon} style={{ height: "30px" }}></img>
                      btn_class = ''
                      print_attachments={true}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
      ) : (
        "No inspections to show"
      )}
    </>
  );
};

export default withRouter(InspectionsTable);
