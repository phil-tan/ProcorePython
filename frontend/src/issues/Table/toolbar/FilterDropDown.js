import React from "react";
import { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";


const FilterDropDown = (props) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);
  const column_name = props.column.name

  useEffect(() => {
    // const curr_options = options
    let options_array = props.items.map((item) => item[column_name]);
    options_array = [...new Set(options_array)];
    const new_options = options_array.map((opt) => ({
      label: opt,
      value: opt,
    }));
    setOptions(new_options);
    setSelected(new_options)
    console.log("if selected all")

    // if(props.items.length===0 || new Set(selected) === new Set(curr_options)){
    //   setSelected(new_options)
    // }
  }, [props.items]);

  useEffect(() => {
    const selected_array = selected.map((opt) => opt.value);
    const filterSet = {...props.filterSet}
    filterSet[column_name] = selected_array
    props.setFilterSet(filterSet)
  }, [selected]);

  return (
    <div key={props.column.name} className="obs-filter form-group">
      <label htmlFor={`${props.column.name}-bs-select`}>{props.column.label}</label>
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


export default FilterDropDown


export function setFilterFormSelected(field, selected) {
  const selected_array = selected.map((opt) => opt.value);
  const payload = { field: field, selected: selected_array };

  return ""
}

export function obs_filters_set(state = null, action) {
    "entered filters reducer";
    let copiedState = Object.assign({}, state);
    copiedState[action.payload.field] = action.payload.selected;
    return copiedState;
}