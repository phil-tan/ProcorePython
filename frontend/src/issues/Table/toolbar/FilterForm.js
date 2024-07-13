import React from "react";
import FilterDropDown from "./FilterDropDown";
import { useState, useEffect } from "react";
import withRouter from "../../../shared/withRouter";
import { apply_all_filters } from "../helpers";


const FilterForm = (props) => {
  const [query, setQuery] = useState("");
  const [filterSet, setFilterSet] = useState([])

  // useEffect(() => {
  //   if(props.obs_filtered.length === 0){
  //     props.apply_obs_filters(props.observations, props.obs_filters_set, '');
  //   }
  // }, [props.observations, props.obs_filters_set]);

  const onSubmit = (e) => {
    e.preventDefault();
    const filteredItems = apply_all_filters(props.items, filterSet, query);
    console.log("submitting filters")
    props.setFilteredItems(filteredItems)
  };

  return (
    <form className="toolbar-section" onSubmit={onSubmit}>
      <div className="d-flex justify-content-between">
        <div>
          <strong>Table Filters </strong>
        </div>
        <div>
          <span>
            <input
              type="submit"
              value="Apply Filters"
              className="btn btn-sm btn-primary"
            />
          </span>
        </div>
      </div>
      <div className="filter-panel">
        {props.columns.map((col) => (
          <FilterDropDown
            key={col.name}
            column={col}
            items={props.items}
            filterSet={filterSet}
            setFilterSet={setFilterSet}
          />
        ))}
      </div>
      <div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="search-bar"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
    </form>
  );
};

export default withRouter(FilterForm)