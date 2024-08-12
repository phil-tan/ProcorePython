import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import withRouter from "../../shared/withRouter";
import { writeIssue } from "./helpers";
import QuillEditor from "./toolbar/QuillEditor";


const EditForm = (props) => {

  const [formState, setFormState] = useState({})
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const assigneeList = props.itemFieldOptions['assignees'] ?? []
  const tradeList = props.itemFieldOptions['trades'] ?? []
  const locationsList = props.itemFieldOptions['locations'] ?? []
  const obsTypesList = props.itemFieldOptions['types'] ?? [{id: 0}]
  const handleOnClick = () => setModalShow(true);
  const [createLoading, setCreateLoading] = useState(false)

  const nextNumber = () => {
    let numbers = props.items.map((item)=>item.number)
    console.log(numbers)
    return String(Math.max(...numbers) + 1)
  }

  const initialize = () => {
    let obj = {}
    let descState = props.item.description ? props.item.description  : "<p> - Enter Description Here - </p>"
    setDescription(descState)
    obj.number = props.item.number ? String(props.item.number) : nextNumber()
    obj.title = props.item.name
    obj.trade_id = props.item.trade ? String(props.item.original.trade.id) : null
    obj.assignee_id = props.item.assignee ? String(props.item.original.assignee.id) : null
    obj.status = props.item.status ? props.item.status.toLowerCase() : 'initiated'
    obj.type_id = props.item.type ? String(props.item.original.type.id) : '562949953689707'
    obj.priority = props.item.priority
    obj.location_id = props.item.location ? String(props.item.original.location.id) : null
    obj.itemDate = props.item.item_date
    obj.inspection_id = props.item.inspection_id ? String(props.item.inspection_id) : null
    setFormState(obj)
    console.log(formState)
  }

  useEffect(()=> {
    initialize()
  }, [props.item])


  const handleCancel = () => {
    console.log('reinitialized form')
    setModalShow(false);
    initialize();

  }

  const handleInputChange = (event) => {
    console.log(event.target.value);
    const { name, value } = event.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    console.log(files);
    setAttachments(files);
  };
      


  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("submitting");
    console.log(formState)
    const new_item = {};
    new_item.name = formState.title ? formState.title : '(No title)'
    new_item.description = description // need Quilljs
    new_item.number = formState.number ? formState.number : null
    new_item.status = formState.status ? formState.status : 'initiated';
    new_item.assignee_id = formState.assignee_id ? formState.assignee_id : null;
    new_item.priority = formState.priority ? formState.priority : null;
    new_item.trade_id = formState.trade_id ? formState.trade_id : null;
    new_item.type_id = formState.type_id ? formState.type_id : '562949953689707'; //commissioning
    new_item.location_id = formState.location_id ? formState.location_id : null;
    if (formState.itemDate) {
      new_item.custom_field_70415 = new Date(formState.itemDate);
    };
    // if (props.origin_form==='inspection_edit'){
    //   obs.checklist_item_id = props.inspection.checklist_items.slice(-1)[0].id
    //   console.log(obs.checklist_item_id)
    // }else if (!formState.inspection_id){
    //   obs.checklist_item_id = null
    // }else if (formState.inspection_id !== obs.inspection_id) {
    //   console.log(props.inspections)
    //   console.log(formState.inspection_id)
    //   const selected_inspection = props.inspections.find(insp=>String(insp.id)===formState.inspection_id)
    //   console.log(selected_inspection)
    //   console.log(selected_inspection.checklist_items.slice(-1))
    //   obs.checklist_item_id = selected_inspection.checklist_items.slice(-1)[0].id
    // }
    console.log(new_item)
    if (props.function === "edit") { 
      // Edit  
      props.setSaving(true) 
      writeIssue('PATCH', props.params.project_id, props.item.id, new_item, attachments).then(
                r=>props.setChangedIssue(r)).then(()=>props.setSaving(false))
    } else {
      // create
      setCreateLoading(true)
      console.log("Creating Item")
      writeIssue('POST', props.params.project_id, null, new_item, attachments).then(
        r=>props.setChangedIssue(r)).then(()=>setCreateLoading(false))
    }
    setAttachments([]);
    setModalShow(false);
  };

  const onDeleteClick = () => {
    console.log('deleting')
    const url = `/api/projects/${props.params.project_id}/issues/${props.item.id}`;
    fetch(url, { method: 'DELETE', credentials: "same-origin"}).then((r) => r.json());
    props.setDeletedIssueID(props.item.id)
    setModalShow(false)
  }

  return (
    <>
      <div style={{ cursor: "pointer" }} onClick={handleOnClick}>
      {createLoading ? <span>Creating Item...<span className="spinner-grow text-primary"></span></span> : <></>}
        {props.text}
      </div>
      <Modal
        style={{
          content: {
            top: "50px",
            left: "200px",
            right: "200px",
            bottom: "50px",
            border: "3px solid",
            borderColor: "#be4d25",
            borderRadius: "10px",
            backgroundColor: "lightgray",
            overflow: "visible"
          },
        }}
        isOpen={modalShow}
        ariaHideApp={false}
      >

        <form onSubmit={onSubmit} encType="multipart/form-data">
          <div className="chart-form-entries" style={{overflowY: 'scroll', height: '65vh'} }>
            <div className="d-flex justify-content-end">
              <div className="form-group" style={{ width: "20%" }}>
                <label>Status</label>
                <select
                  name="status"
                  className="form-select"
                  size="1"
                  value={formState.status}
                  onChange={handleInputChange}
                >
                  <option value="initiated">Initiated</option>
                  <option value="ready_for_review">Ready For Review</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="d-flex justify-content-start">
              <div className="form-group">
                <label>Item Number</label>
                <input
                  name='number'
                  className="form-control"
                  type="number"
                  value={formState.number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  name = 'itemDate'
                  className="form-control"
                  type="date"
                  value={formState.itemDate}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group" style={{ width: "50%" }}>
                <label>Trade</label>
                <select
                  name = 'trade_id'
                  className="form-select"
                  size="1"
                  value={formState.trade_id}
                  onChange={handleInputChange}
                >
                  {tradeList.map((trade) => (
                    <option value={trade.id}>{trade.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ width: "50%" }}>
                <label>Assigned</label>
                <select
                  name = 'assignee_id'
                  className="form-select"
                  size="1"
                  value={formState.assignee_id}
                  onChange={handleInputChange}
                >
                  <option value={null}> </option>
                  {assigneeList.map((assignee) => (
                    <option value={assignee.id}>{assignee.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Title</label>
              <input
                name = 'title'
                className="form-control"
                type="text"
                value={formState.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <div
                style={{
                  border: "1px solid black",
                  padding: "2px",
                  minHeight: "200px",
                  backgroundColor: "white",
                }}
              >
                {<QuillEditor editorHtml={description} setEditorHtml={setDescription}/>}
              </div>
            </div>
            <div className="d-flex justify-content-between">
              <div className="form-group" style={{ width: "40%" }}>
                <label>Type</label>
                <select
                  name = 'type_id'
                  className="form-select"
                  size="1"
                  value={formState.type_id}
                  onChange={handleInputChange}
                >
                  {obsTypesList.map((ot) => (
                    <option value={ot.id}>{ot.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ width: "40%" }}>
                <label>Location</label>
                <select
                  name = 'location_id'
                  className="form-select"
                  size="1"
                  value={formState.location_id}
                  onChange={handleInputChange}
                >
                  <option value=""> </option>
                  {locationsList.map((loc) => (
                    <option value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ width: "40%" }}>
                <label>Priority</label>
                <select
                  name = 'priority'
                  className="form-select"
                  size="1"
                  value={formState.priority}
                  onChange={handleInputChange}
                >
                  <option value={null}> </option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ width: "100%" }} title='To remove attachments, open in Procore'>
              <label>Attachments</label>
              <div className='form-control' style={{backgroundColor: 'lightgray'}}>
              {props.item.id ?
              <>
                {props.item.attachments.length > 0 ?
                  props.item.attachments.map((att)=>
                    <i><u>{`${att.name}`}</u>, </i>
                    ) : <i>No files attached</i>}
                </>
                : <span>No files attached</span> }
              </div>
            </div>
            <div className="form-group" style={{ width: "100%" }}>
              <label>Attach New Files</label>
              <input
                className="form-control"
                type="file"
                multiple
                onChange={handleUpload}
              />
            </div>
            {/* {props.origin_form === 'inspection_edit' ? <></> :
            <div className="form-group" style={{ width: "100%" }}>
                <label>Source/Origin</label>
                <select
                  name = 'inspection_id'
                  className="form-select"
                  size="1"
                  value={formState.inspection_id}
                  onChange={handleInputChange}
                  title = 'Editing appends the observation item to the last checklist item of the checklist.  If this is not desired, edit in Procore'
                >
                  <option value=""> </option>
                  {props.inspections.map((insp) => (
                  <option value={insp.id}>{`${insp.inspection_date} [${insp.name} #${insp.number}] ${insp.description}`}</option>
                  ))}
                </select>
              </div> } */}
            <div className="text-center">
              <br></br>
              {props.function ==='edit' ? <button type='button' className='btn btn-sm btn-danger' onClick={onDeleteClick}>Delete Item</button> : <></>}
            </div>
          </div>
          <hr></hr>
          {props.function === 'edit' ? <a target='_blank' type='button'
            href={`https://us02.procore.com/${props.params.project_id}/project/observations/items/${props.item.id}/edit`}>
                  Open In Procore</a> : <></> }
          <div className="text-end" style={{height: '20%'}}>
            <input
              type="submit"
              value="Save"
              className="btn btn-md btn-primary"
            />
            <button type='button' className="btn btn-md btn-secondary" onClick={handleCancel}>
              Cancel
            </button>

          </div>
        </form>

      </Modal>
    </>
  );
};


export default withRouter(EditForm)