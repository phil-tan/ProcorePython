import React, { useEffect } from "react";
import { useState } from "react";
import { sort_array } from "../../../functions/functions";
import { setObsColumns, setObsShowPhotos } from "../../redux/actions/obs_actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";

const ColumnCheckBoxForm = (props) => {
  const [checkFields, setCheckFields] = useState([]);

  useEffect(() => {
    // const this_check_fields = []
    // props.columns.forEach((col)=>{
    //   this_check_fields.push({name: col.name, label: col.label, show: true})
    // })
    setCheckFields(props.columns);
  }, []);

  const toggleCheck = (e) => {
    const changedCheckFields = [...checkFields];
    const ind = changedCheckFields.findIndex(
      (checkField) => checkField.name === e.target.name
    );
    changedCheckFields[ind].show = e.target.checked;
    setCheckFields(changedCheckFields);
  };

  const changeOrder = (e, if_up) => {
    let changedCheckFields = [...checkFields];
    const ind = changedCheckFields.findIndex(
      (checkField) => checkField.name === e.target.id
    );
    const pos = parseFloat(if_up ? -1.5 : 1.5);
    changedCheckFields[ind].position =
      parseFloat(changedCheckFields[ind].position) + pos;
    changedCheckFields = sort_array(changedCheckFields, "position", false);
    for (let i = 0; i < changedCheckFields.length; i++) {
      changedCheckFields[i].position = i + 1;
    }
    setCheckFields(changedCheckFields);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Columns");
    props.setObsColumns(checkFields);
  };

  return (
    <>
      <form className="toolbar-section" onSubmit={onSubmit}>
        <div className="d-flex justify-content-between">
          <div>
            <strong>Columns Settings </strong>
          </div>
          <div>
            <span>
              <input
                type="submit"
                value="Apply Settings"
                className="btn btn-sm btn-primary"
              />
            </span>
          </div>
        </div>
        <br></br>
        <div
          className="checkbox-container overflow-auto form-control"
          style={{ height: "150px" }}
        >
          <table>
            <tbody>
              {checkFields.map((checkField) => (
                <tr key={checkField.name}>
                  {/* <td><input type='text' style={{width: '2em', textAlign: 'center' }}/></td> */}
                  <td>
                    <BsArrowUp
                      id={checkField.name}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => changeOrder(e, true)}
                    />
                  </td>
                  <td>
                    <BsArrowDown
                      id={checkField.name}
                      style={{ cursor: "pointer" }}
                      onClick={(e) => changeOrder(e, false)}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      id={checkField.name}
                      name={checkField.name}
                      checked={checkField.show}
                      onChange={toggleCheck}
                    />
                  </td>
                  <td>{checkField.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br></br>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            checked={props.obs_show_photos}
            id="show-photos"
            onChange={() => props.setObsShowPhotos()}
          />
          <label className="form-check-label" htmlFor="show-photos">
            Show Photos Under Items
          </label>
        </div>
      </form>
    </>
  );
};

function mapStateToProps(state) {
  return {
    obs_columns: state.obs_columns,
    obs_show_photos: state.obs_show_photos,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setObsColumns, setObsShowPhotos }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnCheckBoxForm);
