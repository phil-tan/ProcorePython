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
   const [createLoading, setCreateLoading] = useState(false)
   const [changedIssue, setChangedIssue] = useState({})
   
   useEffect(() => {
      fetch(`/api/projects/${props.params.project_id}`).then((r)=>r.json()).then((data)=>setProject(data))
      fetch(`/api/projects/${props.params.project_id}/issues`).then((r)=>r.json()
                    ).then((data)=>setIssues(data)).then(setLoading(false))
      fetch(`/api/projects/${props.params.project_id}/issues/fields`).then((r)=>r.json()).then((data)=>setIssuesOptions(data))
   }, []);

   useEffect(()=>{
    if(Object.keys(changedIssue).length > 0){ 
      if(!issues.some(item => item.id === changedIssue.id)){
        const issues_list = [changedIssue, ...issues]
        setIssues(issues_list)
      }else{
        setIssues(issues.map(item => item.id === changedIssue.id ? changedIssue : item))
      }
    }
   },[changedIssue])

  console.log(createLoading)

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

      <div className="d-flex justify-content-end">
      {createLoading ? <span>Creating Item...<span className="spinner-grow text-primary"></span></span> : <></>}
      {createLoading ? <span>Creating Item...</span> : <></>}
      </div>

      <List project={project} 
            items={issues} itemFieldOptions={issuesOptions} 
            setChangedIssue={setChangedIssue}
            />

    </div>


    </div>
  );
}

export default withRouter(IssuesPage);