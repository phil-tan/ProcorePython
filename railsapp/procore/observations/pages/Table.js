import React from "react";
import TableRow from "./TableRow";
import withRouter from "../../shared/withRouter";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { apply_obs_filters } from "../../redux/actions/obs_actions"
import { useEffect } from "react";
import TableColumnHead from "./TableColumnHead";

const Table = (props) => {

  useEffect(() => {
    props.apply_obs_filters(props.observations, props.obs_filters_set, '');
  }, [props.observations]);

  return (
    <>
      {props.observations.length > 0 ? (
        <table className="obs-table table">
          <thead>
            <tr id="obs-header-row" className="obs-header-row" key="header">
              {props.columns.map((col) => (
                <TableColumnHead key={col.name} column={col} />
              ))}
            </tr>
          </thead>

          <tbody>
            {props.obs_filtered.map((item) => {
              return (
                <TableRow
                  columns={props.columns}
                  key={item.id}
                  item={item}
                  show_photos={props.obs_show_photos}
                />
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>
          <hr></hr>
          <h5>No observations items to show </h5>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state) {
  return {
    observations: state.observations,
    obs_filtered: state.obs_filtered,
    obs_filters_set: state.obs_filters_set,
    obs_show_photos: state.obs_show_photos,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ apply_obs_filters }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Table));
