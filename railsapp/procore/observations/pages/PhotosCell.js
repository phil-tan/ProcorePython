import React from "react";
import Image from "./Image";
import withRouter from "../../shared/withRouter";

const PhotosCell = ({ photos, columns }) => {
  function shorten(name_string) {
    if (name_string.length > 23) {
      return name_string.slice(0, 20) + "..." + name_string.slice(-5);
    } else {
      return name_string;
    }
  }

  return (
    <td colSpan={columns.length - 1} className="photos-cell">
      {photos.map((att) => {
        return (
          <div className="photos-inner-cell" key={att.id}>
            <Image src_url={att.url} className="d-none" />
            {/* <img className='obs-img' src={att.url} alt={att.name}/> */}
            <div>
              <a href={att.url} target="_blank">
                {shorten(att.name)}
              </a>
            </div>
          </div>
        );
      })}
    </td>
  );
};

export default PhotosCell;
