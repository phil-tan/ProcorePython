import { combineReducers } from "redux";
import {observations,
  obs_filtered,
  obs_filters_set,
  obs_columns,
  obs_show_photos,
  create_loading,
  obs_loading } from './obs_reducers'
import {
  inspections,
  inspection,
  insp_loading,
  albums,
  photos,
  project} from './insp_reducers'


//Table columns
const obs_table_columns = [
  {
    name: "number",
    label: "#",
    width: "50%",
    show: true,
    filterable: true,
    position: 1,
    className: "text-center",
    textAlign: 'center'
  },
  {
    name: "item_date",
    label: "Item Date",
    width: "80%",
    show: true,
    filterable: true,
    position: 2,
    className: "text-center",
    textAlign: 'center'
  },
  {
    name: "location",
    label: "Location",
    width: "100%",
    show: false,
    filterable: true,
    position: 3,
    className: "text-center",
    textAlign: 'center'
  },
  {
    name: "description",
    label: "Description",
    width: "400%",
    show: true,
    filterable: false,
    position: 4,
    textAlign: 'left'
  },
  {
    name: "responses",
    label: "Responses/Updates",
    width: "300%",
    show: false,
    filterable: false,
    position: 5,
    textAlign: 'left'
  },
  {
    name: "trade",
    label: "Trade",
    width: "100%",
    show: true,
    filterable: true,
    position: 6,
    className: "text-center",
    textAlign: 'center'
  },
  {
    name: "action_by",
    label: "Action By",
    width: "100%",
    show: true,
    filterable: true,
    position: 7,
    className: "text-center",
    textAlign: 'center'
  },
  {
    name: "type",
    label: "Type",
    width: "100%",
    show: false,
    filterable: true,
    position: 8,
    className: "text-center",
    textAlign: 'center'
  },
  {
    name: "priority",
    label: "Priority",
    width: "80%",
    show: false,
    filterable: true,
    position: 9,
    className: "text-center",
    textAlign: 'center'
  },
  {
    name: "status",
    label: "Status",
    width: "80%",
    show: true,
    filterable: true,
    position: 10,
    className: "text-center",
    textAlign: 'center'
  },
];

export const initialState = {
  observations: [],
  obs_filtered: [],
  obs_filters_set: {},
  obs_columns: obs_table_columns,
  obs_show_photos: false,
  obs_loading: true,
  create_loading: false,
  inspections: [],
  inspection: {},
  insp_loading: true,
  albums: [],
  photos: [],
  project: JSON.parse(document.getElementById("app").dataset.project),
};

export const rootReducer = combineReducers({
  observations: observations,
  obs_filtered: obs_filtered,
  obs_filters_set: obs_filters_set,
  obs_columns: obs_columns,
  obs_show_photos: obs_show_photos,
  obs_loading: obs_loading,
  create_loading: create_loading,
  inspections: inspections,
  inspection: inspection,
  albums: albums,
  photos: photos,
  insp_loading: insp_loading,
  project: project,
});
