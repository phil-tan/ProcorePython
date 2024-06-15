import React, { useState, useCallback } from "react";
import { connect } from "react-redux";
import withRouter from "../shared/withRouter";
import { bindActionCreators } from "redux";
import { fetchInspection, fetchAlbums, fetchPhotos, updateInsp } from "../redux/actions/insp_actions"
import { fetchObsList } from "../redux/actions/obs_actions";
import { useEffect } from "react";
import CSILogoHeader from "../../../assets/images/CSILogoHeader.png";
import PrintButton from "./PrintButton";
import { shorten_url } from "../../functions/functions";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
  EditorState,
  ContentState,
  convertFromHTML,
} from "draft-js";
import { stateToHTML } from "draft-js-export-html";
import ObsSection from "./ObsSection";
import Image from "../observations/pages/Image";
import InspPDFDownloadLink from "./InspPDFDownloadLink";
import PDFIcon from "../../../assets/images/pdf-icon.png";
import LoadingSpinner from "../shared/LoadingSpinner"
import EditForm from "../observations/pages/EditForm";
import PhotoForm from "./PhotoForm";


const InspectionEdit = (props) => {
  const [formState, setFormState] = useState({})
  const [summary, setSummary] = useState(EditorState.createEmpty())
  const [attachments, setAttachments] = useState([]);
  const [process, setProcess] = useState('')
  const [photos, setPhotos] = useState([])
  // const assigneeList = JSON.parse(document.getElementById("obs_app").dataset.assignees);
  // const tradeList = JSON.parse(document.getElementById("obs_app").dataset.trades);
  // const locationsList = JSON.parse(document.getElementById("obs_app").dataset.locations);
  // const obsTypesList = JSON.parse(document.getElementById("obs_app").dataset.obstypes);

  useEffect(() => {
    console.log('Fetching List here')
    props.fetchInspection(props.params.project_id, props.params.insp_id);
    props.fetchObsList(props.params.project_id, props.params.insp_id)
  }, []);

  useEffect(() => {
    initialize()
    setProcess('')
  }, [props.inspection]);

  const handleInputChange = (event) => {
    console.log(event.target.value);
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhotoChange = (e) => {
    console.log(e.target.value);
    setPhotos((prevState) => ({
      ...prevState,
      [e.target.id]: {...prevState[e.target.id], ['description']: e.target.value}
    }));
    console.log(photos)
  }

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    setAttachments(files);
  };

  const handleSavePress = (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault(); // Prevent the default browser behavior (e.g., saving the page)
      inspSave()
      console.log('Ctrl+S pressed');
    }
  }

  const inspSave = () => {
    setProcess('Saving')
    document.getElementById('file-upload').value = ''
    console.log('submitting')
    let obj = {...formState}
    console.log(formState)
    obj.custom_field_70440 = stateToHTML(summary.getCurrentContent());
    obj.number = formState.number ? formState.number : null
    obj.custom_field_79604 = formState.album
    obj.status = formState.status ? formState.status : 'Open';
    obj.trade_id = formState.trade_id ? formState.trade_id : null;
    obj.location_id = formState.location_id ? formState.location_id : null;
    if (formState.itemDate) {
      obj.custom_field_70415 = new Date(formState.itemDate);
    };
    if (props.function === "edit") {
      console.log(props.inspection.id)
      props.updateInsp(props.params.project_id, props.inspection.id, obj, attachments, Object.values(photos));
    } else {
      // props.createObs(props.params.project_id, obs, attachments)
      // props.setCreateLoading(true)
    }
    setAttachments([]);
  }

  const onSubmit = (e) => {
    e.preventDefault();

    inspSave();
  };

  const closedStyle = formState.status=='Closed' ? {borderWidth: 0, pointerEvents: 'none'} : null

  const initialize = () => {
    let obj = {}
    let summaryState;
    if (props.function === "edit") {
      const blocksFromHTML = convertFromHTML(
        props.inspection.summary ? props.inspection.summary : ""
      );
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      summaryState = EditorState.createWithContent(contentState);
    } else {
      summaryState = EditorState.createEmpty();
    }
    console.log('initializing')
    setSummary(summaryState)
    let photos_obj = {}
    if(props.inspection.photos){props.inspection.photos.forEach(photo => {
      photos_obj[photo.id] = photo
    })}
    setPhotos(photos_obj)
    console.log('photos')
    console.log(photos)
    obj.description = props.inspection.description
    obj.trade_id = props.inspection.trade ? props.inspection.original.trade.id : null
    obj.status = props.inspection.status
    obj.type_id = props.inspection.type ? props.inspection.original.type.id : null
    obj.location_id = props.inspection.location ? props.inspection.original.location.id : null
    obj.inspection_date = props.inspection.inspection_date
    obj.album = props.inspection.album ? props.inspection.album : ''
    obj.number = props.inspection.number
    console.log(obj)
    setFormState(obj)
    console.log(formState)
  }

  return (
    <div className='row'>
    <div className="inspection-outer col-10">
      <a href={`/projects/${props.params.project_id}/insp_app/insp`}>
        Back to List
      </a>
      <br></br>
      <div id="inspection-paper" onKeyDown={handleSavePress}>
      { props.insp_loading ? <div className='d-block'><LoadingSpinner /></div> :
      <form encType="multipart/form-data">
        <div id="inspection-show">
          <div className='d-block text-end'>
            <a href={`https://us02.procore.com/${props.params.project_id}/project/checklists/lists/${props.inspection.id}`}
            target='_blank'>Open in Procore</a>
          </div>
            <div className='d-flex justify-content-end'>
                <select
                  name="status"
                  className="form-select"
                  style={{width: '25%', display: 'block', fontWeight: 'bold',
                              color: formState.status==='Open' ? 'orangered' : 'green'}}
                  size="1"
                  value={formState.status}
                  onChange={handleInputChange}
                  onKeyDown={handleSavePress}
                >
                  <option value="Open" style={{color: 'orangered', fontWeight: 'bold'}}>Editing</option>
                  <option value="Closed" style={{color: 'green', fontWeight: 'bold'}}>Completed</option>
                </select>
            </div>
          <div>
            <img src={CSILogoHeader} style={{ height: "75px" }} />
          </div>
          <div>
            <h2>{props.inspection.name}</h2>
            <p>{`Last updated: ${new Date(props.inspection.updated_at)}`}</p>
          </div>
          <div>
            <table className="table insp-header">
              <tr>
                <th>Project</th>
                <td>{JSON.parse(document.getElementById('app').dataset.project).name}</td>
              </tr>
              <tr>
                <th>Subject</th>
                <td>
                <input
                  name = 'description'
                  className="form-control"
                  style={closedStyle}
                  type="text"
                  value={formState.description}
                  onChange={formState.status==='Open' ? handleInputChange : null}
                  onKeyDown={handleSavePress}
                />
                </td>
              </tr>
              <tr>
                <th>Date</th>
                <td>
                <input
                  name = 'inspection_date'
                  className="form-control"
                  style={closedStyle}
                  type="date"
                  value={formState.inspection_date}
                  onChange={formState.status==='Open' ? handleInputChange : null}
                  onKeyDown={handleSavePress}
                />
                </td>
              </tr>
            </table>
          </div>
          <h3>Summary</h3>
          <div className='form-control'
                style={{
                  padding: "2px",
                  minHeight: "200px",
                  backgroundColor: "white",
                  ...closedStyle
                }}
                onKeyDown={handleSavePress}
              >
                <Editor
                  toolbarStyle={formState.status==='Closed' ? {display: 'none'} : null}
                  editorState={summary}
                  onEditorStateChange={formState.status === 'Open' ? setSummary : null}
                  toolbar={{
                    options: [
                      // "inline",
                      "list",
                      "textAlign",
                      "link",
                      "history",
                    ],
                  }}
                />
              </div>
          <br></br>
          <h5>Attachments</h5>
          <div className="form-group" style={{ width: "100%" }} title='To remove attachments, open in Procore'>
              <div>
              {props.inspection.id ?
              <>
                {props.inspection.attachments.length > 0 ?
                  props.inspection.attachments.map((att)=>
                   <span><a href={att.url} target='_blank'>{att.name}</a>, </span>
                    ) : <i>No files attached</i>}
                </>
                : <span>No files attached</span> }
              </div>
            </div>
            <br></br>
            <div className="form-group" style={{ width: "100%", ...formState.status==='Closed' ? {display: 'none'} : null}}>
              <label>Attach New Files</label>
              <input
                id='file-upload'
                className="form-control"
                type="file"
                multiple
                onChange={formState.status === 'Open' ? handleUpload : null}
                onKeyDown={handleSavePress}
              />
            </div>
          <br></br>
          {photos ?
          <>
          <h5>Photos</h5>
          <div className='form-group'>
            <label>Name of Photo Album</label>
            <input
                  name = 'album'
                  className="form-control"
                  type="text"
                  value={formState.album}
                  style={closedStyle}
                  onChange={formState.status==='Open' ? handleInputChange : null}
                  onKeyDown={handleSavePress}
                />
          </div>
          <br></br>
          <table className="insp-photos">
            <tbody>
            {Object.keys(photos).map((photo_id, index) => {
            if (index % 2 === 0) {
              let photo_pair = [photos[Object.keys(photos)[index]]]
              if(Object.keys(photos)[index+1]){
                photo_pair.push(photos[Object.keys(photos)[index+1]])
              }
            return(
              <tr key={index}>
              { photo_pair.map(photo =>

                <td
                    style={{
                      width: "50%",
                      height: "300px",
                      marginRight: 2,
                    }}
                  >
                <div style={{
                      padding: 5,
                      border: '1px solid black',
                      textAlign: "center",
                      backgroundColor: "#FFFFFF",
                      height: '100%'
                    }}>
                  <Image
                    style={{
                      objectFit: "contain",
                      maxWidth: "100%",
                      height: "100%",
                      marginBottom: 0,
                    }}
                    src_url={photo.url}
                  />
                  <a
                    href={photo.url}
                    style={{ display: "block" }}
                    target="_blank"
                  >
                    {shorten_url(photo.filename)}
                  </a>
                  <input id={photo.id} type='text' className="text-start w-100" onChange={handlePhotoChange}
                      value={photos[photo.id].description} />
                </div>
              </td>

                )}
              </tr>
              )}})}

              {/* {props.inspection.photos.map((att) => {
                return (
                  <tr className="insp-photo-row" key={att.id}>
                    <td className="insp-img-cell insp-table-cell">
                      <img
                        className="insp-img"
                        src={att.url}
                        alt={att.filename}
                      />
                      <p>
                        <strong>Filename: </strong>
                        <a href={att.url} target="_blank">
                          {shorten_url(att.filename)}
                        </a>
                      </p>
                    </td>
                    <td className="insp-desc-cell insp-table-cell">
                    </td>
                  </tr>
                );
              })} */}
            </tbody>
          </table>
          </> : <></> }
          <div>
          <hr></hr>
          <h5>Noted Issues</h5>
          {props.create_loading ? <span>Creating Item...<span className="spinner-grow text-primary"></span></span> : <></>}
          {formState.status === 'Open' ?
          <button className='btn btn-md btn-primary' type='button'><EditForm
            text='Add Item'
            obs={{}}
            function="new"
            origin_form='inspection_edit'
          /></button> : <></> }
          {props.observations ?
            <ObsSection observations={props.observations} />
          : <></>}
          </div>
        </div>
        </form>
      }
      </div>
    </div>
    <div className='col-2' style={{backgroundColor: 'lightgray', padding: 30, position: 'fixed',  top: 0,
  right: 0,
  bottom: 0,
  }}>
      <br></br>
      <br></br>
      <div>
        <button className='btn btn-lg btn-success w-100 mb-20' onClick={onSubmit}>
        {process==='Saving' ? 'Saving...' : 'Save'}
        </button>
      </div>
      <br></br>
      <div>
      <div style={{textAlign: 'center'}}><h4>PDF Export</h4></div>
      <div style={{display:'block', padding: '3px'}}>
        <a
          target="_blank"
          title="Open PDF"
          href={`/projects/${props.params.project_id}/insp_app/insp/${props.inspection.id}/pdf`}
          className="btn btn-md btn-dark w-100"
        >
          {/* <img src={PDFIcon} style={{ height: "1em" }}></img> */}
        <span>View PDF</span>
        </a>
      </div>
      <div style={{display:'block', padding: '3px'}}>
        <InspPDFDownloadLink
          inspection_id={props.inspection.id}
          print_attachments={false}
          btn_class='btn btn-md btn-dark w-100'
          button_label = {`Download PDF`}
        />
      </div>
      <div style={{display:'block', padding: '3px'}}>
        <InspPDFDownloadLink
          inspection_id={props.inspection.id}
          print_attachments={true}
          btn_class='btn btn-md btn-dark w-100'
          button_label = {`With Attachments`}
        />
      </div>
      </div>
    </div>
  </div>
  );
};

function mapStateToProps(state) {
  return {
    inspection: state.inspection,
    observations: state.observations,
    albums: state.albums,
    photos: state.photos,
    insp_loading: state.insp_loading,
    create_loading: state.create_loading
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    { fetchInspection, fetchAlbums, fetchPhotos, fetchObsList, updateInsp },
    dispatch
  );
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(InspectionEdit)
);
