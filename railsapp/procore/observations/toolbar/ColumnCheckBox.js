import React from "react";
import { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import { setFilterFormSelected } from "../../redux/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

const ColumnCheckBox = (props) => {
  const [selected, setSelected] = useState(false);
  const column = props.column;

  return (
    <div key={column.name} className="obs-filter form-group">
      <label htmlFor={`${column.name}-bs-select`}>{column.label}</label>
      {/* <select className='form-control' multiple id={`${column.name}-bs-select`} data-actions-box="true" name={column.name}>
      { options.map((opt) => <option value={opt}>{opt}</option>) }
      </select> */}
      <MultiSelect
        options={options}
        value={selected}
        onChange={setSelected}
        labelledBy="Select"
      />
    </div>
  );
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setFilterFormSelected }, dispatch);
}

export default connect(null, mapDispatchToProps)(ColumnCheckBox);
