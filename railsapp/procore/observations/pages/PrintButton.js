import ReactDOMServer from "react-dom/server";
// import html2pdf from 'html2pdf.js';
import React from "react";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const PrintButton = () => {
  // const [loaded, setloaded] = useState(false)

  // useEffect(()=>{
  //   window.onload = (event) => {
  //     console.log("page is fully loaded");
  //     setloaded(true)
  //   };
  // },[])

  const printElem = () => {
    document.getElementById("obs-log-header").style.display = "block";
    var printContents = document.getElementById("obs-log").innerHTML;
    var newWin = window.open("/obs/pdf");
    setTimeout(function () {
      newWin.document.body.innerHTML = printContents;
      document.getElementById("obs-log-header").style.display = "none";
      setTimeout(() => {
        console.log("printing");
        newWin.print();
      }, 1000);
    }, 500);

    return true;
  };

  return (
    <>
      <div className="PrintButton">
        <button className="btn btn-primary btn-md" onClick={printElem}>
          Printable
        </button>
      </div>
    </>
  );
};

export default PrintButton;
