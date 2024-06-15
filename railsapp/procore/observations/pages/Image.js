import React from "react";
import { useState, useEffect } from "react";
import imageCompression from "browser-image-compression";

const Image = ({ src_url }) => {
  const [imgURL, setImgURL] = useState("#");

  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 400,
    useWebWorker: true,
  };

  const getImgURL = (src_url) => {
    fetch(src_url, { method: "GET", headers: { "Content-Type": "image/jpeg" } })
      .then((response) => response.blob())
      .then((blob) =>
        imageCompression(new Blob([blob], { type: "image/jpeg" }), options)
      )
      .then((file) => window.URL.createObjectURL(file))
      .then((url) => setImgURL(url));
  };

  useEffect(() => {
    console.log(src_url);
    getImgURL(src_url);
  }, []);

  return (
    <div>
      <img className="obs-img" src={imgURL} />
    </div>
  );
};

export default Image;
