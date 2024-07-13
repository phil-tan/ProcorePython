import React, { useEffect, useState } from 'react';
import NavBar from '../shared/NavBar';
import withRouter from '../shared/withRouter';
import SortableTable from '../projects/SortableTable';
import './issues.css';
import LoadingSpinner from '../shared/LoadingSpinner'
import List from './Table/List';


const IssuesPage = (props) => {
   const [project, setProject] = useState({})
   const [issues, setIssues] = useState([]);
   const [issuesOptions, setIssuesOptions] = useState({'assignees':[], 'locations':[], 'types':[], 'trades':[]  })
   const [loading, setLoading] = useState(true)
   
   useEffect(() => {
      fetch(`/api/projects/${props.params.project_id}`).then((r)=>r.json()).then((data)=>setProject(data))
      fetch(`/api/projects/${props.params.project_id}/issues`).then((r)=>r.json()
                    ).then((data)=>setIssues(data)).then(setLoading(false))
      fetch(`/api/projects/${props.params.project_id}/issues/fields`).then((r)=>r.json()).then((data)=>setIssuesOptions(data))
   }, []);

   console.log(issuesOptions)

  return (
    <div>
      <NavBar />
      <div className="obs-page">
      <nav className="nav nav-pills mt-1">
        <a
          className={`nav-link`}
          type="button"
          href={`/projects/${props.params.project_id}/insp_app/insp`}
        >
          Inspections
        </a>
        <a className={`nav-link active`} target="_blank" type="button">
          Observations
        </a>
      </nav>

      <div className="text-end mb-2">
      {/* <ObsPDFDownloadLink /> */}
      </div>
      <div className="toolbar row gx-1 mb-2">
      <div className="col-3">
         {/* <ColumnCheckBoxForm columns={props.obs_columns} /> */}
      </div>
      <div className="col-9">
         {/* <FilterForm
            columns={props.obs_columns.filter((col) => col.filterable)}
         /> */}
      </div>
      </div>

      <div className="d-flex justify-content-end">
      {/* {props.create_loading ? <span>Creating Item...<span className="spinner-grow text-primary"></span></span> : <></>} */}
      </div>

      <List project={project} items={issues} itemFieldOptions={issuesOptions}/>

    </div>


    </div>
  );
}

export default withRouter(IssuesPage);