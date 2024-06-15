import React from "react";
import { connect } from "react-redux";
import withRouter from "../shared/withRouter";
import { bindActionCreators } from "redux";
import { fetchInspection } from "../redux/actions/insp_actions"
import { useState, useEffect } from "react";
import InspReportTemplate from "./InspReportTemplate";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
// import FileDownloadIcon from "../../../assets/images/file-download-icon.png";
// import FilesDownloadIcon from "../../../assets/images/files-download-icon.png";
import PDFMerger from "pdf-merger-js/browser";

const InspPDFDownloadLink = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    setIsLoading(true);
    console.log("fetching inspection");
    const url = `/projects/${props.params.project_id}/insp/${props.inspection_id}`;
    const inspection = await fetch(url, {
      method: "GET",
      credentials: "same-origin",
    }).then((r) => r.json());
    generatePdfDocument(inspection, props.print_attachments).then(
      setIsLoading(false)
    );
  };

  return (
    <button
      className={props.btn_class}
      title={props.print_attachments ? "Download w/ Attached PDFs" : "Download"}
      // style={{ border: 0 }}
      onClick={handleOnClick}
    >
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-md"></span>
        </>
      ) : (
        <>{props.button_label}</>
      )}
    </button>
  );
};

const generatePdfDocument = async (inspection, print_attachments) => {
  console.log(inspection);
  console.log("generating pdf");
  const report_blob = await pdf(
    <InspReportTemplate inspection={inspection} />
  ).toBlob();
  console.log(report_blob);

  let final_blob;
  if (print_attachments) {
    const att_blob = await downloadAttachments(report_blob, inspection);
    final_blob = await combinePDFs(att_blob);
  } else {
    final_blob = report_blob;
  }

  console.log(final_blob);

  saveAs(
    final_blob,
    `${inspection.inspection_date} ${inspection.description}.pdf`
  );
  // setIsLoading(false)
};

async function downloadPdf(url) {
  // create a new XMLHttpRequest object
  const response = await fetch(url);
  const blob = await response.blob();
  console.log(blob);
  return blob;
}

async function downloadAttachments(report_blob, inspection) {
  const pdf_files = inspection.attachments.filter((att) =>
    att.name.endsWith(".pdf")
  );

  let final_blob = new Array(pdf_files + 1);
  final_blob[0] = report_blob;
  for (let i = 1; i < pdf_files.length + 1; i++) {
    final_blob[i] = await downloadPdf(pdf_files[i - 1].url);
  }
  return final_blob;
}

const combinePDFs = async (files) => {
  const merger = new PDFMerger();
  for (const file of files) {
    await merger.add(file);
  }
  const mergedPdf = await merger.saveAsBlob();
  console.log(mergedPdf);
  return mergedPdf;
};

function mapStateToProps(state) {
  return {
    inspection: state.inspection,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ fetchInspection }, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InspPDFDownloadLink)
);
