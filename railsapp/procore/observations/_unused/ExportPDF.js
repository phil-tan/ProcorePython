import { useRef } from "react";
import React from "react";
import ObsPage from "../pages/ObsPage";
import jsPDF from "jspdf";

function ExportPDF() {
  const reportTemplateRef = useRef(null);

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      orientation: "landscape",
      format: "a3",
      unit: "px",
    });

    // Adding the fonts.
    // doc.setFont('Inter-Regular', 'normal');

    doc.html(reportTemplateRef.current, {
      html2canvas: {
        scale: 0.6,
      },
      callback: async function (doc) {
        await doc.save("document");
      },
    });
  };

  return (
    <div>
      <button className="button" onClick={handleGeneratePdf}>
        Generate PDF
      </button>
      <div ref={reportTemplateRef}>
        <ObsPage />
      </div>
    </div>
  );
}

export default ExportPDF;
