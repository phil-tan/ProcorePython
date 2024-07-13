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


//Table columns

const List = (props) => {
  // const [items, setItems] = useState(props.items)
  const [columns, setColumns] = useState(table_columns)
  const [filteredItems, setFilteredItems] = useState(props.items)
  const [sortedItems, setSortedItems] = useState(props.items)
  const [changedItemsIds, setChangedItemsIds] = useState([])
  const [showItems, setShowItems] = useState(props.items)

  useEffect(()=>{
    console.log(props.items)
    setShowItems(props.items)
    setSortedItems(props.items)
    setFilteredItems(props.items)
  }, [props.items])

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
      <h3><strong>{Object.keys(props.project).length > 0 ? `${props.project.name} - Issues Log`:  ''}</strong></h3>
      <p><strong>Date Printed: </strong>{`${new Date()}`}</p>
      <TableSection showItems={showItems} columns={columns.filter((col) => col.show)} 
              sortedItems={sortedItems} setSortedItems={setSortedItems}
              itemFieldOptions={props.itemFieldOptions}/>
    </div>
    </>
  );
};

export default withRouter(List);