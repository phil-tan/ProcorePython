import React from "react";
import { bindActionCreators } from "redux";
import withRouter from "../../shared/withRouter";
import { connect } from "react-redux";
import { apply_obs_filters } from "../../redux/actions/obs_actions"
import FilterDropDown from "./FilterDropDown";
import { useState, useEffect } from "react";
import { obs_filtered } from "../../redux/reducers/obs_reducers";


const FilterForm = (props) => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    if(props.obs_filtered.length === 0){
      props.apply_obs_filters(props.observations, props.obs_filters_set, '');
    }
  }, [props.observations, props.obs_filters_set]);

  const onSubmit = (e) => {
    e.preventDefault();
    props.apply_obs_filters(props.observations, props.obs_filters_set, query);
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

function mapStateToProps(state) {
  return {
    observations: state.observations,
    obs_filtered: state.obs_filtered,
    obs_filters_set: state.obs_filters_set,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ apply_obs_filters }, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FilterForm)
);
