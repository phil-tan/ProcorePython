import React from "react";
import { useState, useEffect } from "react";

const SummaryText = ({ insp, expandAll }) => {
  const [expand, setExpand] = useState(false);

  useEffect(() => setExpand(false), [expandAll]);

  const handleToggle = () => {
    setExpand(!expand);
  };
  return (
    <div>
      <a type="button" className="text-blue" onClick={handleToggle}>
        <u>
          <h5>{`${insp.inspection_date} - ${insp.description}`}</h5>
        </u>
      </a>
      {expand || expandAll ? (
        <>
          <div
            className="inspection-summary text-justify"
            dangerouslySetInnerHTML={{ __html: insp.summary }}
          ></div>
          <br></br>
          {insp.attachments.length > 0 ? (
            <div>
              <strong>Attachments</strong>
            </div>
          ) : (
            <></>
          )}
          <div>
            {insp.attachments.map((att) => (
              <p className="mb-0">
                <a href={att.url} target="_blank">
                  {att.name}
                </a>
              </p>
            ))}
          </div>
          <hr></hr>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export const Summary = (props) => {
  const [expandAll, setExpandAll] = useState(false);
  const inspections =
    props.type === "all"
      ? props.inspections
      : props.inspections.filter(
          (insp) => insp.inspection_type.name === props.type
        );

  const handleExpandAll = () => setExpandAll(!expandAll);

  return (
    <div className="container">
      <div>
        <button onClick={handleExpandAll}>Expand/Collapse All</button>
      </div>
      <br></br>
      {inspections.length > 0 ? (
        <>
          {" "}
          {inspections.map((insp) => (
            <SummaryText insp={insp} expandAll={expandAll} />
          ))}{" "}
        </>
      ) : (
        "No inspections to show"
      )}
    </div>
  );
};
