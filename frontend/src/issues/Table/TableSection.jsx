import React from "react";
import TableRow from "./TableRow";
import withRouter from "../../shared/withRouter";
// import TableColumnHead from "./TableColumnHead";
import { table_columns } from "./columns";
import { useState, useEffect } from "react";
import '../issues.css'
import { sortList } from "./helpers";

//Table columns   `   

const TableSection = (props) => {
  console.log('showing table')
  console.log(props.showItems.length)
  console.log(props.itemFieldOptions)

  return (
    <>
      {props.showItems.length > 0 ? (
        <table className="obs-table table">
        <TableHeaderRow columns={props.columns} sortedItems={props.sortedItems} setSortedItems={props.setSortedItems} />
          <tbody>
            {props.showItems.map((item) => {
              return (
                <TableRow columns={props.columns} key={item.id} item={item} show_photos={false} 
                itemFieldOptions={props.itemFieldOptions}
                />
              );
            })}
          </tbody>
        </table>
      ) : (
        <div>
          <hr></hr>
          <h5>No items to show </h5>
        </div>
      )}
    </>
  );
};

export default withRouter((TableSection));


const TableHeaderRow = (props) => {
  const [if_desc, setSortDesc] = useState(true);

  const headerClick = (e) => {
    setSortDesc(!if_desc);
    console.log(e.target.id)
    console.log(if_desc)
    const new_list = sortList(props.sortedItems, e.target.id, if_desc)
    props.setSortedItems(new_list)
  };

  return (
    <thead className='thead-dark'>
      <tr>
      {props.columns.map((col) => (
      <th
        scope="col"
        style={{ width: col.width, color: "white", backgroundColor: "darkblue"}}
        className={`obs-header-row ${col.className}`}
      >
        <div id={col ? col.name : ""} onClick={headerClick}>
          {col ? col.label : ""}
        </div>
      </th>
      ))}
      </tr>
    </thead>
  );
};

{/* <div id="obs-log" >
<h3>
  <strong>{Object.keys(project).length > 0 ? `${project.name} - Issues Log`:  ''}</strong>
</h3>
<p>
  <strong>Date Printed: </strong>
  {`${new Date()}`}
</p>
{loading ? (
  <LoadingSpinner />
) : (
   <table className="table table-striped">
   <thead className="table-dark">
     <tr>
       <th scope="col">Project</th>
       <th scope="col">Name</th>
       <th scope="col">Issues</th>
       <th scope="col">Address</th>
       <th scope="col">Start</th>
       <th scope="col">Completion</th>
       <th scope="col">Company</th>
     </tr>
   </thead>
   <tbody>
   {issues.map((issue)=>
     <tr>
       <td>{issue["number"]}</td>
       <td>{issue["item_date"]}</td>
       <td>{issue["name"]}</td>
       <td>{issue["description"]}</td>
       <td>placeholder</td>
       <td>{issue["action_by"]}</td>
       <td>{issue["status"]}</td>
     </tr>
 )}
   </tbody>
 </table>
)}
</div> */}