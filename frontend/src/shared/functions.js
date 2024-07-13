import React from "react";

export function format_date(date_string) {
  const d = new Date(date_string);
  return d.toISOString().split("T")[0];
}

export function sort_by_column(observations, column_name, if_desc) {
  const dir = if_desc ? [-1, 1] : [1, -1];
  let obs_array = [];
  observations.forEach((obs) => {
    obs_array.push({ field: obs[column_name], obj: obs });
  });
  obs_array.sort((a, b) =>
    a.field > b.field ? dir[0] : b.field > a.field ? dir[1] : 0
  );
  let new_observations = [];
  obs_array.forEach((el) => new_observations.push(el.obj));
  return new_observations;
}

export function sort_array(array, field, if_desc) {
  const dir = if_desc ? [-1, 1] : [1, -1];
  return array.sort((a, b) =>
    a[field] > b[field] ? dir[0] : b[field] > a[field] ? dir[1] : 0
  );
}

export function shorten_url(name_string) {
  if (name_string.length > 23) {
    return name_string.slice(0, 20) + "..." + name_string.slice(-5);
  } else {
    return name_string;
  }
}

export function standardizeFontSize(BodyText) {
  let newBodyText;
  const re = new RegExp("font-size:.*;", "g");
  const re2 = new RegExp("font-family:.*;", "g");
  newBodyText = BodyText ? BodyText.replaceAll(re, "") : "";
  newBodyText = BodyText ? BodyText.replaceAll(re2, "") : "";
  return newBodyText
}

export function openLink(url) {
  const headers = { 'Authorization' : "Bearer #{procore_token['access_token']}", 'Procore-Company-Id' : '562949953436954'  }
  const request = new Request(url, { headers: headers });
  const newTab = window.open('', '_blank');
  fetch(request)
  .then(response => response.text())
  .then(data => {
    // Handle the response data
    newTab.document.write(data);
  })
  .catch(error => {
    // Handle any errors
    console.error('Error:', error);
  });
}

export function checkObs(obs, filters) {
  // return Object.entries(filters).every(([field, filter])=>checkObsOneFilter(filter, obs[field]))
  console.log("checking obs");
  Object.keys(filters).forEach((field) => {
    console.log(field);
    console.log(obs[field]);
    console.log(filters[field]);
    console.log(filters[field].includes(obs[field]));
  });
  console.log(
    Object.keys(filters).every((field) => filters[field].includes(obs[field]))
  );
  return Object.keys(filters).every((field) =>
    filters[field].includes(obs[field])
  );
}

export function statusColor(cellContent) {
  switch (cellContent.toLowerCase()) {
    case "closed":
      return "green";
    case "ready_for_review":
      return "blue";
    case "initiated":
      return "darkred";
    default:
      return "";
  }
}
