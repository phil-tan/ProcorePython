import React from "react";
import TableRow from "./TableRow";
import withRouter from "../../shared/withRouter";
// import TableColumnHead from "./TableColumnHead";
import { table_columns } from "./columns";
import { useState, useEffect } from "react";
import TableSection from "./TableSection";
import { sortList } from "./helpers";
import FilterSection from "./FilterSection"
import '../issues.css'
import EditForm from "./EditForm";

//Table columns

const List = (props) => {
  // const [items, setItems] = useState(props.items)
  const [columns, setColumns] = useState(table_columns)
  const [filteredItems, setFilteredItems] = useState(props.items)
  const [sortedItems, setSortedItems] = useState(props.items)
  const [showItems, setShowItems] = useState(props.items)
  const [deletedIssueID, setDeletedIssueID] = useState(0)

  useEffect(()=>{
    console.log(props.items)
    setShowItems(props.items)
    setSortedItems(props.items)
    setFilteredItems(props.items)
  }, [props.items])

  useEffect(()=>{
    const updatedIssues = showItems.filter(item => item.id !== deletedIssueID)
    setShowItems(updatedIssues)
    console.log(deletedIssueID)
    console.log("setting show after deleting")
   }, [deletedIssueID])

  useEffect(()=>{
    console.log(filteredItems)
    const filtered_ids = new Set(filteredItems.map(item => item.id));
    const sortedAndFilteredItems = sortedItems.filter(item => filtered_ids.has(item.id));
    setShowItems(sortedAndFilteredItems)
  }, [sortedItems, filteredItems])

  return (
    <>
    <FilterSection items={props.items} setFilteredItems={setFilteredItems} columns={columns} setColumns={setColumns}/>
    <div id="obs-log" >
    <div className="d-flex justify-content-end">
      {props.create_loading ? <span>Creating Item...<span className="spinner-grow text-primary"></span></span> : <></>}
            <span>
              <EditForm
                text={<button
                  className="btn btn-md"
                  style={{ color: "white", backgroundColor: "orangered" }}
                >
                  Add Item
                </button> }
                item={{}}
                items={props.items}
                function="add"
                origin_form=""
                itemFieldOptions={props.itemFieldOptions}
                setChangedIssue={props.setChangedIssue}
                setDeletedIssueID = {setDeletedIssueID}
              />
            </span>
          </div>
      <h3><strong>{Object.keys(props.project).length > 0 ? `${props.project.name} - Issues Log`:  ''}</strong></h3>
      <p><strong>Date Printed: </strong>{`${new Date()}`}</p>
      <TableSection showItems={showItems} columns={columns.filter((col) => col.show)} 
              sortedItems={sortedItems} setSortedItems={setSortedItems}
              itemFieldOptions={props.itemFieldOptions} setChangedIssue={props.setChangedIssue}
              setDeletedIssueID = {setDeletedIssueID} />
    </div>
    </>
  );
};

export default withRouter(List);