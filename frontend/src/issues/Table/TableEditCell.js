import React, { useState } from "react";
import { standardizeFontSize, format_date } from "../../shared/functions.js";
// import ReactDOMServer from "react-dom/server";
// import { Html } from "react-pdf-html";
import withRouter from "../../shared/withRouter.js";
import { table_columns } from "./columns.js";
import { cellColorClass } from "./helpers.js";
import EditForm from "./EditForm.jsx";

const editMode = true

const TableEditCell = (props) => {

  let div = <tr>TableCell</tr>
  // return(div)
  console.log(props.itemFieldOptions)
  switch (props.field) {
    case "number":
      div = (
        <th
          // rowSpan={props.show_photos ? 2 : 1}
          key="number"
          scope="row"
          className="text-center"
        >
          {props.item.loading ? (
            <span className="spinner-grow text-primary"></span>
          ) : (
            <a href={`https://us02.procore.com/${props.params.project_id}/project/observations/items/${props.item.id}/edit`} target="_blank">
              {props.item.number}
            </a>
          )}
        </th>
      );
      break;
    case "item_date":
      div = (
        <td key="item_date" className="text-center">
          {props.item.item_date}
        </td>
      );
      break;
    case "description":
      div = (
        <td key="description">
          <EditForm 
          item={props.item}
          text={<strong>{props.item.name}</strong>}
          function="edit"
          origin_form=""
          itemFieldOptions={props.itemFieldOptions}
          />
          <div className="text-justify" dangerouslySetInnerHTML={{
              __html: standardizeFontSize(props.item.description),
            }}
          ></div>
          <p>
            {props.item.attachments.length > 0 ? "|| " : ""}
            {props.item.attachments.map((att) => {
              return (
                <span>
                  <a href={att.url} target="_blank" rel="noreferrer">
                    {att.name}
                  </a>
                  ,{" "}
                </span>
              );
            })}
          </p>
        </td>
      );
      break;
    case "responses":
      div = (
        <td key="responses">
          {props.item.responses.map((res) => {
            return res ? (
              <div className="comment-div text-justify">
                <p>
                  <strong>{format_date(res.created_at)}</strong>{" "}
                  <i>{res.created_by.name}</i>: {res.comment}.{" "}
                  {res.attachments.map((att) => (
                    <span>
                      {"| "}
                      <a href={att.url}>{att.name}</a>{" "}
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              <></>
            );
          })}
        </td>
      );
      break;
    case "trade":
      div = (
        <td key="trade" className="text-center">
          {props.item.trade ? props.item.trade : "---"}
        </td>
      );
      break;
    case "action_by":
      div = (
        <td key="action_by" className="text-center">
          {props.item.action_by}
        </td>
      );
      break;
    case "status":
      div = (
        <td
          key="status"
          className={`text-center ${cellColorClass(
            props.item.status
          )}`}
        >
          {editMode ? <div className="form-group" style={{ width: "90%" }}>
                <label>Status</label>
                <select
                  name="status"
                  className="form-select"
                  size="1"
                  value={props.item.status}
                  onChange={(e)=>console.log(e)}
                  // value={formState.status}
                  // onChange={handleInputChange}
                >
                  <option value="initiated">Initiated</option>
                  <option value="ready_for_review">Ready For Review</option>
                  <option value="closed">Closed</option>
                </select>
              </div> : props.item.status}
        </td>
      );
      break;
    default:
      div = (
        <>
       <td key={props.field} className="text-center">
          {props.item[props.field]}
        </td> 
      </>
      );
      // div = <td>This is a table cell</td>
      break;
  }
  return div
  // return props.if_pdf ? (
  //   <Html>{ReactDOMServer.renderToStaticMarkup(<table>{div}</table>)}</Html>
  // ) : (
  //   div
  // );
};

export default withRouter(TableEditCell);
