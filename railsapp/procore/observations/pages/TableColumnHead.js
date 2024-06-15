import React from "react";
import withRouter from "../../shared/withRouter";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { sort_column } from "../../redux/actions/obs_actions";
import { useState } from "react";

const TableColumnHead = (props) => {
  const [if_desc, setSortDesc] = useState(true);

  const headerClick = (e) => {
    setSortDesc(!if_desc);
    props.sort_column(props.obs_filtered, e.target.id, if_desc);
  };

  return (
    <>
      <th
        scope="col"
        style={{ width: props.column ? props.column.width : "" }}
        className={props.column ? props.column.className : ""}
      >
        <div id={props.column ? props.column.name : ""} onClick={headerClick}>
          {props.column ? props.column.label : ""}
        </div>
      </th>
    </>
  );
};

function mapStateToProps(state) {
  return {
    obs_filtered: state.obs_filtered,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ sort_column }, dispatch);
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TableColumnHead)
);
