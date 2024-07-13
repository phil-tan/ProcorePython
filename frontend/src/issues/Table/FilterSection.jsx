
import React from 'react'
import ColumnCheckBoxForm from './toolbar/ColumnCheckBoxForm'
import FilterForm from './toolbar/FilterForm'

const FilterSection = (props) => {
  return (
   <div className="toolbar row gx-1 mb-2">
      <h3>Filters</h3>
   <div className="col-3">
     <ColumnCheckBoxForm columns={props.columns} setColumns={props.setColumns}/>
   </div>
   <div className="col-9">
     <FilterForm
        items = {props.items}
        columns={props.columns.filter((col) => col.filterable)}
        setFilteredItems={props.setFilteredItems}
     />
   </div>
   </div>
  )
}

export default FilterSection


