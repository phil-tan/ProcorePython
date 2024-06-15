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
import CSILogoHeader from "../../../assets/images/CSILogoHeader.png";
import { shorten_url } from "../../functions/functions";
import { format_caption, statusColor } from "../../functions/functions";
import ImageCustom from "../shared/ImageCustom";

// Font.register({ family: 'Helvetica' });
// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: "10px",
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
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: "row",
    borderWidth: 0,
    borderBottomWidth: 1,
  },
  photoRow: {
    flexDirection: "row",
    borderWidth: 0,
    display: "table",
    marginBottom: "2px",
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
  },
  tableCell: {
    textAlign: "left",
    padding: 5,
  },
  imageCell: {
    padding: 5,
    borderWidth: 1,
    textAlign: "center",
    backgroundColor: "#FFFFFF",
  },
});

function standardizeFontSize(summaryText) {
  const re = new RegExp("font-size:.*pt;", "g");
  return summaryText ? summaryText.replaceAll(re, "") : "";
}

const SummaryReact = (props) => (
  <>
    <style>
      {`li {
                maxWidth: 90%;
            }
          p {
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
      dangerouslySetInnerHTML={{ __html: props.summary }}
    ></div>
  </>
);

const Caption = ({ photo, side }) => (
  <>
    <style>
      {`p, span {
          font-size: 10px;
          margin: 0 0 1 0;
      }`}
    </style>
    <p>
      <span style={{ fontFamily: "Helvetica-Bold" }}>
        {" "}
        {`Figure ${photo.order} (${side}). `}
      </span>
      <span>{photo.caption}</span>
    </p>
  </>
);

// Create Document Component
const InspReportTemplate = (props) => {
  const summaryHtml = ReactDOMServer.renderToStaticMarkup(
    <SummaryReact
      fontsz="10px"
      summary={standardizeFontSize(props.inspection.summary)}
    />
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Image
            src={CSILogoHeader}
            style={{ height: "60px", width: "100px" }}
          />
        </View>
        <View style={styles.title}>
          <Text>{props.inspection.name}</Text>
        </View>
        <View style={styles.sectionText}>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={{ width: "25%" }}>
                <Text style={styles.tableHeaderCell}>Project:</Text>
              </View>
              <View style={{ width: "75%" }}>
                <Text style={styles.tableCell}>
                  {JSON.parse(document.getElementById('app').dataset.project).name}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ width: "25%" }}>
                <Text style={styles.tableHeaderCell}>Description:</Text>
              </View>
              <View style={{ width: "75%" }}>
                <Text style={styles.tableCell}>
                  {props.inspection.description}
                </Text>
              </View>
            </View>
            <View style={styles.tableRow}>
              <View style={{ width: "25%" }}>
                <Text style={styles.tableHeaderCell}>Date:</Text>
              </View>
              <View style={{ width: "75%" }}>
                <Text style={styles.tableCell}>
                  {props.inspection.inspection_date}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Text>Summary</Text>
        </View>
        <View style={styles.sectionText}>
          <Html>{summaryHtml}</Html>
        </View>

        {props.inspection.attachments.length > 0 ? (
          <View style={styles.sectionHeader}>
            <Text>Attachments</Text>
          </View>
        ) : (
          <></>
        )}

        <View style={styles.sectionText}>
          {props.inspection.attachments.map((att) => (
            <Link src={att.url}>{att.name}</Link>
          ))}
        </View>

        {props.inspection.photos.length > 0 ? (
          <View style={styles.sectionHeader}>
            <Text>Photos</Text>
          </View>
        ) : (
          <></>
        )}

        <View style={styles.sectionText}>
          {props.inspection.photos.map((att, i) => {
            if (i % 2 === 0) {
              return (
                <View styles={{ marginBottom: "10px" }}>
                  <View wrap={false} style={styles.photoRow} key={att.id}>
                    {/* <View style={{widt'10px' '30%', height: '250px', padding: 5}}>
              <Text style={styles.tableCell}>{att.description}</Text>
            </View> */}

                    <View
                      style={{ width: "50%", height: "230px", marginRight: 2 }}
                    >
                      <View style={styles.imageCell}>
                        <ImageCustom
                          style={{
                            objectFit: "contain",
                            maxWidth: "100%",
                            height: "100%",
                            marginBottom: 0,
                          }}
                          src_url={props.inspection.photos[i].url}
                        />
                        <Link
                          href={props.inspection.photos[i].url}
                          style={{ display: "block" }}
                          target="_blank"
                        >
                          {shorten_url(props.inspection.photos[i].filename)}
                        </Link>
                      </View>
                    </View>
                    {props.inspection.photos[i + 1] ? (
                      <View style={{ width: "50%", height: "230px" }}>
                        <View style={styles.imageCell}>
                          <ImageCustom
                            style={{
                              objectFit: "contain",
                              maxWidth: "100%",
                              height: "100%",
                            }}
                            src_url={props.inspection.photos[i + 1].url}
                          />
                          <Link
                            href={props.inspection.photos[i + 1].url}
                            style={{ display: "block" }}
                            target="_blank"
                          >
                            {shorten_url(
                              props.inspection.photos[i + 1].filename
                            )}
                          </Link>
                        </View>
                      </View>
                    ) : (
                      <></>
                    )}
                  </View>

                  <View wrap={false} style={styles.sectionText}>
                    {/* <View wrap={false} style={{display: 'flex', flexDirection: 'row', marginTop: '2px'}}>
              <Text style={{fontFamily: 'Helvetica-Bold', display: 'flex', flexDirection: 'row'}}>{`Figure ${props.inspection.photos[i].order}. `}</Text>
              <Text style={{display: 'flex', flexDirection: 'row'}}>{props.inspection.photos[i].caption}</Text>
            </View> */}

                    <Html>
                      {ReactDOMServer.renderToStaticMarkup(
                        <Caption
                          photo={props.inspection.photos[i]}
                          side="left"
                        />
                      )}
                    </Html>
                    {/* <Text style={{fontFamily: 'Helvetica-Bold'}}>{`Figure ${props.inspection.photos[i].order}. `}</Text>
            <Text>{props.inspection.photos[i].caption}</Text> */}
                    {props.inspection.photos[i + 1] ? (
                      <>
                        <Html>
                          {ReactDOMServer.renderToStaticMarkup(
                            <Caption
                              photo={props.inspection.photos[i + 1]}
                              side="right"
                            />
                          )}
                        </Html>
                      </>
                    ) : (
                      <></>
                    )}
                  </View>
                </View>
              );
            } else {
              return <></>;
            }
          })}
        </View>
        {props.inspection.observations.length > 0 ? (
          <View style={styles.sectionHeader}>
            <Text>{"Issues / Action Items"}</Text>
          </View>
        ) : (
          <></>
        )}

        {props.inspection.observations.map((obs) => {
          const obs_photos = obs.attachments.filter(
            (att) =>
              att.name.endsWith(".jpg") ||
              att.name.endsWith(".jpeg") ||
              att.name.endsWith(".png")
          );

          const obs_title =  `${obs.number} - ${obs.name}`
          const obs_action_by = obs.action_by ? ` | [${obs.action_by}]` : ''

          return (
            <View wrap={false} style={styles.obsRow}>
              <View style={styles.sectionText}>
                <Text style={{textAlign: 'right', color: statusColor(obs.status), fontFamily: "Helvetica-Bold"}}>{obs.status}</Text>
                <Text
                  style={{ fontFamily: "Helvetica-Bold" }}
                >{`${obs_title}${obs_action_by}`}</Text>
                <Text>
                  <Html style={styles.sectionText}>{obs.description}</Html>
                </Text>
              </View>
              <View wrap={false}>
                {obs_photos.map((att, i) => {
                  if (i % 2 === 0) {
                    return (
                      <View wrap={false} style={styles.photoRow} key={att.id}>
                        <View
                          style={{
                            width: "50%",
                            height: "230px",
                            marginRight: 2,
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
                        {obs_photos[i + 1] ? (
                          <View style={{ width: "50%", height: "230px" }}>
                            <View style={styles.imageCell}>
                              <Image
                                style={{
                                  objectFit: "contain",
                                  maxWidth: "100%",
                                  height: "100%",
                                }}
                                src={obs_photos[i + 1].url}
                              />
                              <Link
                                href={obs_photos[i + 1].url}
                                style={{ display: "block" }}
                                target="_blank"
                              >
                                {shorten_url(obs_photos[i + 1].filename)}
                              </Link>
                            </View>
                          </View>
                        ) : (
                          <></>
                        )}
                      </View>
                    );
                  } else {
                    <></>;
                  }
                })}
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

export default InspReportTemplate;
