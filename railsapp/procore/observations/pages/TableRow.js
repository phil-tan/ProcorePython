import React from "react";
import TableCell from "./TableCell";
import PhotosCell from "./PhotosCell";

const TableRow = (props) => {
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
          props.item.loading
            ? {
                color: "gray",
                backgroundColor: "whitesmoke",
                fontStyle: "italic",
                border: "blue",
              }
            : {}
        }
      >
        {props.columns.map((col) => (
          <TableCell
            key={col.name}
            field={col.name}
            show_photos={show_photos}
            item={props.item}
            item_responses={props.item_responses}
            item_pdf_link={props.item_pdf_link}
          />
        ))}
      </tr>
      {show_photos ? (
        <tr>
          <PhotosCell
            key={props.item.id}
            photos={photos}
            columns={props.columns}
          />
        </tr>
      ) : (
        <></>
      )}
    </>
  );
};

export default TableRow;
