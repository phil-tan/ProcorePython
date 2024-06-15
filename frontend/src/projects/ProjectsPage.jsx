import React from 'react'
import { useState, useEffect } from 'react'

const ProjectsPage = () => {
   const [projects, setProjects] = useState([])

   useEffect(() => {
      fetch("/projects",  {
                           method: "GET",
                           credentials: "same-origin",
           }).then(r => r.json()).then(data => setProjects(data))
    },[])
    return (
      <ul>
        {projects.map((project, index) => (
          <span>
            <a href='#' key={index}>{project.name}</a>
          </span>
        ))}
      </ul>
    );

}

export default ProjectsPage