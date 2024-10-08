
export function cellColorClass(cellContent) {
   switch (cellContent.toLowerCase()) {
     case "closed":
       return "status-closed";
     case "ready_for_review":
       return "status-ready-for-review";
     default:
       return "";
   }
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

 export function sortList(items, column_name, if_desc) {
   const dir = if_desc ? [-1, 1] : [1, -1];
   let item_array = [];
   items.forEach((item) => {
     item_array.push({ field: item[column_name], obj: item });
   });
   item_array.sort((a, b) =>
     a.field > b.field ? dir[0] : b.field > a.field ? dir[1] : 0
   );
   let new_items = [];
   item_array.forEach((item) => new_items.push(item.obj));
   return new_items;
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

export function apply_all_filters(items, filterSet, query) {
  let filtered_items = items.filter((item) => checkItem(item, filterSet));
  if (query.length > 0) {
    filtered_items = filtered_items.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    );
  }
  console.log("applying filters")
  console.log(filtered_items)
  return filtered_items
}

export function checkItem(item, filters) {
  // return Object.entries(filters).every(([field, filter])=>checkObsOneFilter(filter, obs[field]))
  console.log(`checking item ${item.number}`);
  Object.keys(filters).forEach((field) => {
    console.log(field);
    console.log(filters[field].includes(item[field]));
  });
  console.log(
    Object.keys(filters).every((field) => filters[field].includes(item[field]))
  );
  return Object.keys(filters).every((field) =>
    filters[field].includes(item[field])
  );
}

export function format_date(date_string) {
  const d = new Date(date_string);
  return d.toISOString().split("T")[0];
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

export async function writeIssue(method, project_id, item_id, item, attachments) {
  console.log("Updating issue");
  const formData = new FormData();
  formData.append('project_id', project_id);
  formData.append('item', JSON.stringify(item));
  console.log(attachments)
  attachments.forEach((file, index) => {
    formData.append(`attachments[${index}]`, file);
  });
  let url = ''
  if(method === 'PATCH'){
    url = `/api/projects/${project_id}/issues/${item_id}`;
  }else{
    url = `/api/projects/${project_id}/issues`;
  }

  const resp = await fetch(url, {
    method: method,
    credentials: "same-origin",
    // headers: {
    //   // 'Content-Type': 'multipart/form-data',
    //   // "X-CSRF-Token": document
    //   //   .querySelector('meta[name="csrf-token"]')
    //   //   .getAttribute("content"),
    // },
    body: formData,
    }).then((r) => r.json());
  
return resp
}