import SortableTable from "./SortableTable";
import LoadingSpinner from "../shared/LoadingSpinner"
import React, { Component } from "react";
import { useEffect, useState } from "react";

const ObsPage = (props) => {
   // const project_id = props.params.project_id;
   const items = useState([])
   useEffect(() => {
     // props.setLoading(true);
   }, []);
 
   return (
     <div className="obs-page">
       <nav className="nav nav-pills mt-1">
         <a
           className={`nav-link`}
           type="button"
           href={`/projects/${props.params.project_id}/insp_app/insp`}
         >
           Inspections
         </a>
         <a className={`nav-link active`} target="_blank" type="button" href='/'>
           Observations
         </a>
       </nav>

           <div id="obs-log" style={{ printColorAdjust: "exact" }}>
             <h3>
               <strong>{`- Issues Log`}</strong>
             </h3>
             <p>
               <strong>Date Printed: </strong>
               {`${new Date()}`}
             </p>
             {props.obs_loading ? (
               <LoadingSpinner />
             ) : (
               <SortableTable data={items} />
             )}
           </div>
     </div>
   );
 };

 export default ObsPage