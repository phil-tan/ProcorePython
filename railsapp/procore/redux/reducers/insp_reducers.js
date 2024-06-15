import {
  FETCH_INSP_LIST,
  FETCH_INSPECTION,
  FETCH_ALBUMS,
  FETCH_PHOTOS,
  FETCH_PROJECT,
  UPDATE_INSP
} from "../actions/insp_actions";

export function inspections(state = null, action) {
  switch (action.type) {
    case FETCH_INSP_LIST:
      return action.payload;
    default:
      return state;
  }
}

export function inspection(state = null, action) {
  switch (action.type) {
    case FETCH_INSPECTION:
      const inspection = action.payload;
      return inspection;
    case UPDATE_INSP:
      return action.payload
    default:
      return state;
  }
}

export function albums(state = null, action) {
  switch (action.type) {
    case FETCH_ALBUMS:
      return action.payload;
    default:
      return state;
  }
}

export function photos(state = null, action) {
  switch (action.type) {
    case FETCH_PHOTOS:
      let photos = action.payload.filter((photo) =>
        photo.description.includes("[Figure ")
      );
      return photos;
    default:
      return state;
  }
}

export function insp_loading(state = null, action) {
  switch (action.type) {
    case FETCH_INSP_LIST:
      return false;
    case FETCH_INSPECTION:
      return false;
    default:
      return state;
  }
}

export function project(state = null, action) {
  switch (action.type) {
    case FETCH_PROJECT:
      return action.payload;
    default:
      return state;
  }
}
