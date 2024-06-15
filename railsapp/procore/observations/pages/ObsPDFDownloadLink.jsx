import React from "react";
import { connect } from "react-redux";
import withRouter from "../../shared/withRouter";
import { bindActionCreators } from "redux";
import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import ObsPDFTableTemplate from "./ObsPDFTableTemplate";

const ObsPDFDownloadLink = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    setIsLoading(true);
    console.log("generating pdf");
    generatePdfDocument(
      props.obs_filtered,
      props.obs_columns,
      props.show_photos
    ).then(() => setIsLoading(false));
  };

  return (
    <button className="btn btn-success btn-md" onClick={handleOnClick}>
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-md"></span>
        </>
      ) : (
        "Download PDF"
      )}
    </button>
  );
};

const generatePdfDocument = async (obs_filtered, obs_columns, show_photos) => {
  console.log("generating pdf");
  const report_blob = await pdf(
    <ObsPDFTableTemplate
      obs_filtered={obs_filtered}
      obs_columns={obs_columns.filter((col) => col.show)}
      show_photos={show_photos}
    />
  ).toBlob();
  console.log(report_blob);

  saveAs(report_blob, `Observations Log.pdf`);
  // setIsLoading(false)
};

function mapStateToProps(state) {
  return {
    obs_filtered: state.obs_filtered,
    obs_columns: state.obs_columns,
    show_photos: state.obs_show_photos,
  };
}

export default withRouter(connect(mapStateToProps, null)(ObsPDFDownloadLink));
