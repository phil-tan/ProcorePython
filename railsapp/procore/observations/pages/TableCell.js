import React from "react";
import { format_date } from "../../../functions/functions";
import { standardizeFontSize } from "../../../functions/functions";
import ReactDOMServer from "react-dom/server";
import { Html } from "react-pdf-html";
import EditForm from "./EditForm";
import withRouter from "../../shared/withRouter";


function cellColorClass(cellContent) {
  switch (cellContent.toLowerCase()) {
    case "closed":
      return "status-closed";
    case "ready_for_review":
      return "status-ready-for-review";
    default:
      return "";
  }
}

const TableCell = (props) => {
  let div = "initialdiv";
  // return(div)

  switch (props.field) {
    case "number":
      div = (
        <th
          rowSpan={props.show_photos ? 2 : 1}
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
          {/* <EditForm
            text=<p className="obs-title">
              <strong>{props.item.name}</strong>
            </p>
            obs={props.item}
            function="edit"
            origin_form='obs_table'
          /> */}
          <div
            className="text-justify"
            dangerouslySetInnerHTML={{
              __html: standardizeFontSize(props.item.description),
            }}
          ></div>
          <p>
            {props.item.attachments.length > 0 ? "|| " : ""}
            {props.item.attachments.map((att) => {
              return (
                <span>
                  <a href={att.url} target="_blank">
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
          {props.item.status}
        </td>
      );
      break;
    default:
      div = (
        <td key={props.field} className="text-center">
          {props.item[props.field]}
        </td>
      );
      // div = <td>This is a table cell</td>
      break;
  }
  return props.if_pdf ? (
    <Html>{ReactDOMServer.renderToStaticMarkup(<table>{div}</table>)}</Html>
  ) : (
    div
  );
};

export default withRouter(TableCell);
