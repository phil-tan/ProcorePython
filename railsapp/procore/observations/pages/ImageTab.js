import React from "react";
import { useParams } from "react-router-dom";

const ImageTab = () => {
  const { image_path } = useParams();

  return (
    <div>
      <img src={image_path} alt={image_path} />
    </div>
  );
};

export default ImageTab;
