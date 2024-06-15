// import {
//   FETCH_OBS_LIST,
//   SORT_BY_COLUMN,
//   APPLY_OBS_FILTERS,
//   SET_FILTER_FORM_SELECTED,
//   SET_OBS_COLUMNS,
//   SET_OBS_SHOW_PHOTOS,
//   UPDATE_OBS,
//   SET_ITEM_LOADING, SET_CREATE_LOADING,
//   CREATE_OBS, DELETE_OBS, SET_LOADING,
// } from "../actions/obs_actions";


// export function observations(state = null, action) {
//   let new_observations;
//   let index;
//   switch (action.type) {
//     case FETCH_OBS_LIST:
//       console.log("fetched prelim list");
//       return action.payload;
//     case UPDATE_OBS:
//       new_observations = [...state];
//       index = new_observations.findIndex((obs) => obs.id === action.payload.id);
//       if (index !== -1) {
//         new_observations[index] = action.payload;
//       }
//       return new_observations;
//     case CREATE_OBS:
//       new_observations = [...state, action.payload];
//       return new_observations
//     case DELETE_OBS:
//       new_observations = [...state];
//       index = new_observations.findIndex((obs) => obs.id === action.payload);
//       if (index !== -1) {
//         new_observations.splice(index, 1);
//       }
//       return new_observations;
//     default:
//       return state;
//   }
// }

// export function obs_filtered(state = null, action) {
//   switch (action.type) {
//     case APPLY_OBS_FILTERS:
//       console.log("writing filtered observations");
//       return action.payload;
//     case SET_ITEM_LOADING:
//       let new_observations;
//       new_observations = [...state];
//       const index = new_observations.findIndex((obs) => obs.id === action.payload);
//       if (index !== -1) {
//         new_observations[index].loading = true;
//         console.log("set obsveration to loading");
//       }
//       return new_observations;
//     case SORT_BY_COLUMN:
//       return action.payload;
//     default:
//       return state;
//   }
// }

// export function obs_filters_set(state = null, action) {
//   switch (action.type) {
//     case SET_FILTER_FORM_SELECTED:
//       "entered filters reducer";
//       let copiedState = Object.assign({}, state);
//       copiedState[action.payload.field] = action.payload.selected;
//       return copiedState;
//     default:
//       return state;
//   }
// }

// export function obs_columns(state = null, action) {
//   switch (action.type) {
//     case SET_OBS_COLUMNS:
//       return action.payload;
//     default:
//       return state;
//   }
// }

// export function obs_show_photos(state = null, action) {
//   switch (action.type) {
//     case SET_OBS_SHOW_PHOTOS:
//       return !state;
//     default:
//       return state;
//   }
// }

// export function create_loading(state = null, action) {
//   switch (action.type) {
//     case SET_CREATE_LOADING:
//       return action.payload
//     case CREATE_OBS:
//       return false;
//     default:
//       return state;
//   }
// }

// export function obs_loading(state = null, action) {
//   switch (action.type) {
//     case SET_LOADING:
//       return action.payload
//     case FETCH_OBS_LIST:
//       return false;
//     case UPDATE_OBS:
//       return false;
//     case DELETE_OBS:
//       return false;
//     case CREATE_OBS:
//       return false;
//     default:
//       return state;
//   }
// }
