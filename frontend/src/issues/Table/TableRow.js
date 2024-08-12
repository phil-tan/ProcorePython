import React from "react";
import TableCell from "./TableCell";
import TableEditCell from "./TableEditCell";
import { useState, useEffect } from "react";
// import PhotosCell from "./PhotosCell";

const TableRow = (props) => {
  const [saving, setSaving] = useState(false)

  const photos = props.item.attachments.filter(
    (att) =>
      att.name.endsWith(".jpg") ||
      att.name.endsWith(".jpeg") ||
      att.name.endsWith(".png")
  );
  const show_photos = photos.length > 0 && props.show_photos;
  
  return (
    <>
      <tr
        style={
         saving 
            ? {
                color: "gray",
                backgroundColor: "whitesmoke",
                fontStyle: "italic",
                border: "blue",
              }
            : {fontStyle: "normal",}
        }
      >
        {props.columns.map((col) => (
          <>
          <TableCell
            key={col.name}
            field={col.name}
            show_photos={show_photos}
            item={props.item}
            item_responses={props.item_responses}
            item_pdf_link={props.item_pdf_link}
            itemFieldOptions={props.itemFieldOptions}
            setChangedIssue={props.setChangedIssue}
            setDeletedIssueID = {props.setDeletedIssueID}
            setSaving={setSaving}
          />
          </>
        ))}
      </tr>
      {/* {show_photos ? (
        <tr>
          <PhotosCell
            key={props.item.id}
            photos={photos}
            columns={props.columns}
          />
        </tr>
      ) : (
        <></>
      )} */}
    </>
  );
};

export default TableRow;
