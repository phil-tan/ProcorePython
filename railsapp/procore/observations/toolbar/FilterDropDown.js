import React from "react";
import { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import { setFilterFormSelected } from "../../redux/actions/item_actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";


const FilterDropDown = (props) => {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState([]);

  const column = props.column;

  useEffect(() => {
    const curr_options = options
    let options_array = props.items.map((item) => item[column.name]);
    options_array = [...new Set(options_array)];
    const new_options = options_array.map((opt) => ({
      label: opt,
      value: opt,
    }));
    setOptions(new_options);
    console.log("if selected all")
    console.log(selected)
    console.log(curr_options)
    if(props.item_filtered.length===0 || new Set(selected) === new Set(curr_options)){
      setSelected(new_options)
    }
  }, [props.items]);


  useEffect(() => {
    props.setFilterFormSelected(column.name, selected);
  }, [selected, options]);

  return (
    <div key={column.name} className="item-filter form-group">
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

function mapStateToProps(state) {
  return {
    items: state.items,
    item_filtered: state.item_filtered,
    item_filters_set: state.item_filters_set,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ setFilterFormSelected }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterDropDown);
