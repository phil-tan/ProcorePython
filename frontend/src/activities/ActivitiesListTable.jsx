import React, { useState, useEffect } from 'react'
import withRouter from '../shared/withRouter';
import NavBar from '../shared/NavBar';

const ActivitiesListTable = (props) => {
   const [project, setProject] = useState({})
   const [activities, setActivities] = useState([])
   const [loading, setLoading] = useState(true)
   const [searchTerm, setSearchTerm] = useState('');

   const handleChange = (event) => {
      setSearchTerm(event.target.value);
    };
  
    const filtered = activities.filter(item =>
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

   useEffect(() => {
      fetch(`/api/projects/${props.params.project_id}`).then((r)=>r.json()).then((data)=>setProject(data))
      fetch(`/api/projects/${props.params.project_id}/activities`).then(
               (r)=>r.json()).then((data)=>setActivities(data)).then(setLoading(false))
   }, []);

   return (
      <div>
      <NavBar />
    <div className='container'>
    <h3><strong>{Object.keys(project).length > 0 ? `${project.name}`:  ''}</strong></h3>
    <br></br>
    <h2>Your Activities</h2>
    <br></br>
    <div className='form-group'>
       <input
        className='form-control'
         type="text"
         placeholder="Search..."
         value={searchTerm}
         onChange={handleChange}
       />
    </div>
    <table className="table table-striped">
      <thead className="table-dark">
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Activity</th>
          <th scope="col">Title</th>
          <th scope="col">Summary</th>
          <th scope="col">Status</th>
          <th scope="col">Download</th>
        </tr>
      </thead>
      <tbody>
      {filtered.map((activity)=>
        <tr>
          <td>{activity["inspection_date"]}</td>
          <td>{activity["name"]}</td>
          <td>{activity["description"]}</td>
          <td><div
            className="text-justify"
            dangerouslySetInnerHTML={{ __html: activity["summary"] }}
          ></div></td>
          <td>{activity["status"]}</td>
          <td>{activity["download"]}</td>
        </tr>
    )}
      </tbody>
    </table>
    </div>

    </div>
   )

   
}

export default withRouter(ActivitiesListTable)