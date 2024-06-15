// import { sort_by_column } from "../../../functions/functions";
// import { checkObs } from "../../../functions/functions";


// // Action Names
// export const FETCH_OBS_LIST = "FETCH_OBS_LIST";
// export const FETCH_ONE_OBS = "FETCH_ONE_OBS";
// export const FETCH_OBS_RESPONSES = "FETCH_OBS_RESPONSES";
// export const SORT_BY_COLUMN = "SORT_BY_COLUMN";
// export const APPLY_OBS_FILTERS = "APPLY_OBS_FILTERS";
// export const SET_FILTER_FORM_SELECTED = "SET_FILTER_FORM_SELECTED";
// export const SET_OBS_COLUMNS = "SET_OBS_COLUMNS";
// export const SET_OBS_SHOW_PHOTOS = "SET_OBS_SHOW_PHOTOS";
// export const FETCH_OBS_PDF_LINK = "FETCH_OBS_PDF_LINK";
// export const SET_LOADING = "SET_LOADING";
// export const UPDATE_OBS = "UPDATE_OBS";
// export const SET_MODAL_SHOW = "SET_MODAL_SHOW";
// export const SET_ITEM_LOADING = "SET_ITEM_LOADING";
// export const CREATE_OBS = 'CREATE_OBS'
// export const DELETE_OBS = 'DELETE_OBS'
// export const SET_CREATE_LOADING = 'SET_CREATE_LOADING'
// export const FETCH_INSP_LIST = 'FETCH_INSP_LIST'


// //Observations
// export function fetchObsList(project_id, inspection_id) {
//   let url;
//   if (inspection_id){
//     url = `/projects/${project_id}/insp/${inspection_id}/observations`
//   }else{
//     url = `/projects/${project_id}/obs`;
//   }
//   const promise = fetch(url, {
//     method: "GET",
//     credentials: "same-origin",
//   }).then((r) => r.json());
//   return {
//     type: FETCH_OBS_LIST,
//     payload: promise,
//   };
// }

// export function fetchOneObs(project_id, obs_id) {
//   const url = `/projects/${project_id}/obs/${obs_id}`;
//   const promise = fetch(url, {
//     method: "GET",
//     credentials: "same-origin",
//   }).then((r) => r.json());
//   return {
//     type: FETCH_ONE_OBS,
//     payload: promise,
//   };
// }

// export function sort_column(observations, field, if_desc) {
//   const new_observations = sort_by_column(observations, field, if_desc);
//   return {
//     type: SORT_BY_COLUMN,
//     payload: new_observations,
//   };
// }

// export function apply_obs_filters(observations, filters_applied, query) {
//   let filtered_obs = observations.filter((obs) =>
//       checkObs(obs, filters_applied)
//     );
//     if (query.length > 0) {
//       filtered_obs = filtered_obs.filter((obs) =>
//         Object.values(obs).some((val) =>
//           String(val).toLowerCase().includes(query.toLowerCase())
//         )
//       );
//     }
//   console.log(observations);

//   return {
//     type: APPLY_OBS_FILTERS,
//     payload: filtered_obs,
//   };
// }

// export function setFilterFormSelected(field, selected) {
//   const selected_array = selected.map((opt) => opt.value);
//   const payload = { field: field, selected: selected_array };

//   return {
//     type: SET_FILTER_FORM_SELECTED,
//     payload: payload,
//   };
// }

// export function setObsColumns(columns) {
//   // let new_columns = []
//   // for (let i = 0; i < obs_table_columns.length; i++) {
//   //   let new_column = obs_table_columns[i]
//   //   if(selected_array.includes(obs_table_columns[i].name)){
//   //     new_column.show = true
//   //   }
//   //   new_columns.push(obs_table_columns[i])
//   // }

//   return {
//     type: SET_OBS_COLUMNS,
//     payload: columns,
//   };
// }

// export function setObsShowPhotos() {
//   return {
//     type: SET_OBS_SHOW_PHOTOS,
//     payload: "",
//   };
// }

// export function setLoading(value) {
//   return {
//     type: SET_LOADING,
//     payload: value,
//   };
// }

// export function setCreateLoading(value) {
//   return {
//     type: SET_CREATE_LOADING,
//     payload: value,
//   };
// }
// export function setModalShow(value) {
//   return {
//     type: SET_MODAL_SHOW,
//     payload: value,
//   };
// }

// export function updateObs(project_id, obs_id, obs, attachments) {
//   console.log("Updating Obs");
//   const formData = new FormData();
//   formData.append("observation[project_id]", project_id);
//   formData.append("observation[observation]", JSON.stringify(obs));
//   attachments.forEach((file, index) => {
//     formData.append(`observation[attachments[${index}]`, file);
//   });

//   const url = `/projects/${project_id}/obs/${obs_id}`;
//   const promise = fetch(url, {
//     method: "PATCH",
//     credentials: "same-origin",
//     headers: {
//       // 'Content-Type': 'multipart/form-data',
//       "X-CSRF-Token": document
//         .querySelector('meta[name="csrf-token"]')
//         .getAttribute("content"),
//     },
//     body: formData,
//   }).then((r) => r.json());
//   return {
//     type: UPDATE_OBS,
//     payload: promise,
//   };
// }

// export function setItemLoading(obs_id) {
//   return {
//     type: SET_ITEM_LOADING,
//     payload: obs_id,
//   };
// }

// export function createObs(project_id, obs, attachments) {
//   console.log("Creating Obs");
//   const formData = new FormData();
//   formData.append("observation[project_id]", project_id);
//   formData.append("observation[observation]", JSON.stringify(obs));
//   attachments.forEach((file, index) => {
//     formData.append(`observation[attachments[${index}]`, file);
//   });

//   const url = `/projects/${project_id}/obs`;
//   const promise = fetch(url, {
//     method: "POST",
//     credentials: "same-origin",
//     headers: {
//       // 'Content-Type': 'multipart/form-data',
//       "X-CSRF-Token": document
//         .querySelector('meta[name="csrf-token"]')
//         .getAttribute("content"),
//     },
//     body: formData,
//   }).then((r) => r.json());
//   return {
//     type: CREATE_OBS,
//     payload: promise,
//   };
// }

// export function deleteObs(project_id, obs_id) {
//   const url = `/projects/${project_id}/obs/${obs_id}`
//   const promise = fetch(url, {
//     method: "DELETE",
//     credentials: "same-origin",
//     headers: {
//       // 'Content-Type': 'multipart/form-data',
//       "X-CSRF-Token": document
//         .querySelector('meta[name="csrf-token"]')
//         .getAttribute("content"),
//     },
//   }).then((r) => r.json());
//   return {
//     type: DELETE_OBS,
//     payload: obs_id,
//   };
// }

// export function fetchInspList(project_id) {
//   const url = `/projects/${project_id}/insp`;
//   const promise = fetch(url, {
//     method: "GET",
//     credentials: "same-origin",
//   }).then((r) => r.json());
//   return {
//     type: FETCH_INSP_LIST,
//     payload: promise,
//   };
// }
