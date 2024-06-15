import ReactDOMServer from "react-dom/server";
// import html2pdf from 'html2pdf.js';
import React from "react";
import { useLocation } from "react-router-dom";

const PrintButton = () => {
  const printElem = () => {
    // document.getElementById('obs-log-header').style.display='block';
    var printContents = document.getElementById("inspection-paper").innerHTML;
    var newWin = window.open("/obs/pdf");
    setTimeout(function () {
      newWin.document.body.innerHTML = printContents;
      // document.getElementById('obs-log-header').style.display='none';
      // setTimeout(()=>{
      //   console.log('printing')
      //   newWin.print();
      //   newWin.close();
      // }, 1000);
    }, 500);

    return true;
  };

  return (
    <div className="PrintButton">
      <button className="btn btn-primary btn-md" onClick={printElem}>
        Printable
      </button>
    </div>
  );
};

export default PrintButton;

// function PrintButton() {

//   const printHandler = () => {
//     // const printElement = ReactDOMServer.renderToString(pdfJSX());
//     const printElement = document.getElementById('obs-log')
//     // const printElement = pdfJSX();
//     const opt = {
//       // margin:       30,
//       // filename:     'myfile.pdf',
//       html2canvas:  { scale: 0.6 },
//       // jsPDF:        { unit: 'px', format: 'A3', orientation: 'landscape', userUnit: 72 }
//     };

//     // html2pdf().from(printElement).set(opt).save();
//     html2pdf().from(printElement).save();
//   }

//   return (
//     <div className="PrintButton">
//       <button onClick={printHandler}>Print</button>
//     </div>
//   );
// }

// export default PrintButton;
