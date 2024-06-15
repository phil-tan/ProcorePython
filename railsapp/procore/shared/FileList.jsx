import React, { useState } from "react";

const FileList = ({ files, onDelete }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  return (
    <ul>
      {files.map((file, index) => (
        <span>
          <a
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <a type="button" className="btn btn-sm btn-secondary">
              {file.name}
              {hoveredIndex === index && (
                <a
                  type="button"
                  className="btn btn-sm btn-danger"
                  onClick={() => onDelete(index)}
                >
                  X
                </a>
              )}
            </a>
          </a>
        </span>
      ))}
    </ul>
  );
};

export default FileList;
