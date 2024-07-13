import React, { useEffect, useState } from 'react';
import NavBar from '../shared/NavBar';
// import './App.css';



const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  // const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
 
  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filtered = projects.filter(item =>
    item.display_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchData('/api/projects');
  }, []);

  const fetchData = async (endpoint) => {
    const response = await fetch(endpoint);
    const data = await response.json();
    setProjects(data);
    console.log(data)
  };

  return (
    <div>
      <NavBar />
    <div className='container'>
    <h2>Your Projects</h2>
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
          <th scope="col">Project</th>
          <th scope="col">Name</th>
          <th scope="col">Issues</th>
          <th scope="col">Activities</th>
          <th scope="col">Start</th>
          <th scope="col">Completion</th>
          <th scope="col">Company</th>
        </tr>
      </thead>
      <tbody>
      {filtered.map((project)=>
        <tr>
          <td><a href={`/app/projects/${project.id}`}>{project["display_name"]}</a></td>
          <td>{project["name"]}</td>
          <td><a href={`/app/projects/${project.id}/issues`}>Issues</a></td>
          <td><a href={`/app/projects/${project.id}/activities`}>Activities</a></td>
          <td>{project["completion_date"]}</td>
          <td>{project["company"]["name"]}</td>
        </tr>
    )}
      </tbody>
    </table>
    </div>

    </div>
  );
}

export default AllProjects;