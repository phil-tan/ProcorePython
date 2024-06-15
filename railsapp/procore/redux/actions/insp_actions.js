// Action Names
export const FETCH_INSP_LIST = "FETCH_INSP_LIST";
export const FETCH_INSPECTION = "FETCH_INSPECTION";
export const FETCH_ALBUMS = "FETCH_ALBUMS";
export const FETCH_PHOTOS = "FETCH_PHOTOS";
export const SET_LOADING = "SET_LOADING";
export const FETCH_PROJECT = "FETCH_PROJECT";
export const UPDATE_INSP = 'UPDATE_INSP'

export function fetchProject(project_id) {
  const url = `/projects/${project_id}`;
  const promise = fetch(url, {
    method: "GET",
    credentials: "same-origin",
  }).then((r) => r.json());
  return {
    type: FETCH_PROJECT,
    payload: promise,
  };
}

export function fetchInspList(project_id) {
  const url = `/projects/${project_id}/insp`;
  const promise = fetch(url, {
    method: "GET",
    credentials: "same-origin",
  }).then((r) => r.json());
  return {
    type: FETCH_INSP_LIST,
    payload: promise,
  };
}

export function fetchInspection(project_id, insp_id) {
  const url = `/projects/${project_id}/insp/${insp_id}`;
  const promise = fetch(url, {
    method: "GET",
    credentials: "same-origin",
  }).then((r) => r.json());
  return {
    type: FETCH_INSPECTION,
    payload: promise,
  };
}

export function fetchAlbums(project_id) {
  const url = `/projects/${project_id}/albums`;
  const promise = fetch(url, {
    method: "GET",
    credentials: "same-origin",
  }).then((r) => r.json());
  return {
    type: FETCH_ALBUMS,
    payload: promise,
  };
}

export function fetchPhotos(project_id, album_id) {
  const url = `/projects/${project_id}/albums/${album_id}`;
  const promise = fetch(url, {
    method: "GET",
    credentials: "same-origin",
  }).then((r) => r.json());
  return {
    type: FETCH_PHOTOS,
    payload: promise,
  };
}

export function setLoading(value) {
  return {
    type: SET_LOADING,
    payload: value,
  };
}

export function updateInsp(project_id, insp_id, body, attachments, photos) {
  console.log("Updating Insp");
  const formData = new FormData();
  formData.append("body[project_id]", project_id);
  formData.append("body[list]", JSON.stringify(body));
  attachments.forEach((file, index) => {
    formData.append(`body[attachments[${index}]`, file);
  });
  photos.forEach((photo, index) => {
    formData.append(`body[photos[${index}]`, JSON.stringify(photo));
  });

  const url = `/projects/${project_id}/insp/${insp_id}`;
  const promise = fetch(url, {
    method: "PATCH",
    credentials: "same-origin",
    headers: {
      // 'Content-Type': 'multipart/form-data',
      "X-CSRF-Token": document
        .querySelector('meta[name="csrf-token"]')
        .getAttribute("content"),
    },
    body: formData,
  }).then((r) => r.json());
  return {
    type: UPDATE_INSP,
    payload: promise,
  };
}
