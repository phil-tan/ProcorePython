import React, { useEffect, useState } from 'react';
import withRouter from '../shared/withRouter'

const ProjectPage = (props) => {
   const [activities, setActivities] = useState([])
   const project_id = props.params.project_id

   // useEffect(() => {
   //    fetch(`/api/projects/${props.params.project_id}`).then((r)=>r.json()).then((data)=>setProject(data))
   //    fetch(`/api/projects/${props.params.project_id}/issues`).then((r)=>r.json()).then((data)=>setIssues(data)).then(setLoading(false))
   // }, []);

   return (
      <div>ProjectPage</div>
   )
}

export default withRouter(ProjectPage)