import React from "react";
import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";
import { Image, Link, PDFDownloadLink } from "@react-pdf/renderer";

const ImageCustom = ({ src_url, style }) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 400,
    useWebWorker: true,
  };

  const getImgURL = async (src_url) => {
    const imgURL = await fetch(src_url, {
      method: "GET",
      headers: { "Content-Type": "image/jpeg" },
    })
      .then((response) => response.blob())
      .then((blob) =>
        imageCompression(new Blob([blob], { type: "image/jpeg" }), options)
      )
      .then((file) => window.URL.createObjectURL(file));
    return imgURL;
  };

  const imgURL = getImgURL(src_url);

  return (
    <div>
      {imgURL.length > 2} ? <Image style={style} src={imgURL} /> : {null}
    </div>
  );
};

export default ImageCustom;
