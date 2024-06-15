import React from "react";
import ReactDOMServer from "react-dom/server";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Font,
  Image,
  Link,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import { Html } from "react-pdf-html";
import CSILogoHeader from "../../../../assets/images/CSILogoHeader.png";
import { format_date } from "../../../functions/functions";
import { shorten_url, standardizeFontSize, statusColor } from "../../../functions/functions";

// import ImageCustom from '../../shared/ImageCustom';
// import PhotosCell from './PhotosCell';
// import TableCell from './TableCell';

// Font.register({ family: 'Helvetica' });
// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#FFFFFF",
    padding: 40,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 10,
    marginBottom: 10,
    textAlign: "justify",
    width: "100%",
    display: "table",
  },
  table: {
    display: "table",
    width: "auto",
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderTopWidth: 0.5,
    borderRightWidth: 0.5,
    borderLeftWidth: 1,
    display: "table",
  },
  photoRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0.5,
    display: "table",
    paddingLeft: 40,
  },
  obsRow: {
    borderWidth: 1,
    display: "table",
    padding: 5,
    marginBottom: "2px",
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
  },
  tableHeaderCell: {
    textAlign: "left",
    padding: 5,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    borderWidth: 0,
    borderRightWidth: 1,
    color: "white",
  },
  imageCell: {
    padding: 5,
    borderWidth: 0.5,
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },
});

const tableCellHtml = (item, field) => {
  let div = <>{"initialdiv"}</>;
  // return(div)

  switch (field) {
    case "number":
      div = (
        <a href={item.pdf_link.pdf_url} target="_blank">
          {item.number}
        </a>
      );
      break;
    case "item_date":
      div = <div>{item.item_date}</div>;
      break;
    case "description":
      div = (
        <>
          <p style={{ color: "darkblue" }}>
            <strong>{item.name}</strong>
          </p>
          <ToHtml div={standardizeFontSize(item.description)} />
          <p>
            {item.attachments.length > 0 ? "|| " : ""}
            {item.attachments.map((att) => {
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
        </>
      );
      break;
    case "responses":
      div = (
        <>
          {item.responses.map((res) => {
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
        </>
      );
      break;
    case "trade":
      div = <>{item.trade ? item.trade : ''}</>;
      break;
    case "action_by":
      div = <>{item.action_by ? item.action_by : ''}</>;
      break;
    case "status":
      div = (
        <span style={{ color: statusColor(item.status) }}>
          <strong>{item.status}</strong>
        </span>
      );
      break;
    default:
      div = <>{item[field]}</>;
      break;
  }

  const cellHtml = ReactDOMServer.renderToStaticMarkup(
    <ToHtml div={ReactDOMServer.renderToString(div)} />
  );
  return cellHtml;
};

const ToHtml = ({ div }) => (
  <>
    <style>
      {`li {
                maxWidth: 90%;
            }
          p, div {
              font-size: 10px;
              margin: 0 0 8px 0;
          }
          ul, ol {
            margin: 0 0 8px 0;
          }
          td {
            border: 1px solid black;
            padding: 2px;
          }
          strong {
            font-family: Helvetica-Bold;
          }`}
    </style>
    <div
      className="text-justify"
      style={{ fontSize: "10px" }}
      dangerouslySetInnerHTML={{ __html: div }}
    ></div>
  </>
);

// Create Document Component
const ObsPDFTableTemplate = ({ obs_columns, obs_filtered, show_photos }) => {
  console.log(show_photos);

  return (
    <Document>
      <Page size="A3" style={styles.page} orientation="landscape">
        <View>
          <Image
            src={CSILogoHeader}
            style={{ height: "60px", width: "100px" }}
          />
        </View>
        <View style={styles.title}>
          <Text>{`${
            JSON.parse(document.getElementById("app").dataset.project).name
          } - Issues Log`}</Text>
        </View>
        <View style={styles.sectionText}>
          <Html style={styles.sectionText}>
            {ReactDOMServer.renderToStaticMarkup(
              <p>
                <strong>Date Printed: </strong>
                {`${new Date()}`}
              </p>
            )}
          </Html>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow} wrap={false}>
            {obs_columns.map((col) => (
              <View
                style={{
                  width: col.width,
                  display: "table",
                  borderRightWidth: 1,
                  backgroundColor: "darkblue",
                }}
              >
                <View style={ {
                        textAlign: col.textAlign,
                        padding: 5,
                        fontSize: 10,
                        fontFamily: "Helvetica-Bold",
                        borderWidth: 0,
                        borderRightWidth: 1,
                        color: "white",
                                         }}>
                  <Text>{col.label}</Text>
                </View>
              </View>
            ))}
          </View>
          {obs_filtered.map((obs) => {
            const obs_photos = obs.attachments.filter(
              (att) =>
                att.name.endsWith(".jpg") ||
                att.name.endsWith(".jpeg") ||
                att.name.endsWith(".png")
            );
            return (
              <>
                <View style={styles.tableRow} wrap={false}>
                  {obs_columns.map((col) => (
                    <View
                      style={{
                        width: col.width,
                        display: "table",
                        borderRightWidth: 0.5,
                      }}
                    >
                      <View style={{ textAlign: col.textAlign, padding: 5, fontSize: 10}}>
                        <Html>{tableCellHtml(obs, col.name)}</Html>
                      </View>
                    </View>
                  ))}
                </View>
                {obs_photos.length > 0 && show_photos ? (
                  <View wrap={false} style={styles.photoRow}>
                    {obs_photos.map((att, i) => (
                      <View
                        style={{
                          width: "25%",
                          height: "230px",
                          marginRight: 2,
                          padding: 5,
                        }}
                      >
                        <View style={styles.imageCell}>
                          <Image
                            style={{
                              objectFit: "contain",
                              maxWidth: "100%",
                              height: "100%",
                              marginBottom: 0,
                            }}
                            src={obs_photos[i].url}
                          />
                          <Link
                            href={obs_photos[i].url}
                            style={{ display: "block" }}
                            target="_blank"
                          >
                            {shorten_url(obs_photos[i].filename)}
                          </Link>
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <></>
                )}
              </>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default ObsPDFTableTemplate;
