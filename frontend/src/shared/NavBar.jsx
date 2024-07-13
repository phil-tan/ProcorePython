import React from 'react'
import procoreLogo from '../assets/procore-logo.png';

const NavBar = ({project_name}) => {
  return (
   <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
   <a className="navbar-brand" href="#"><img src={procoreLogo} height="40" alt="Procore"/></a>
   <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
     <span className="navbar-toggler-icon"></span>
   </button>
   <div className="collapse navbar-collapse" id="navbarNavDropdown">
     <ul className="navbar-nav nav-tabs">
       <li className='nav-item'><a className='nav-link' href="/">My Projects</a></li>
       <li className='nav-item'><a className='nav-link' href="/refreshtoken">Refresh</a></li>
       <li className='nav-item'><a className='nav-link' href="/">Sign Out</a></li>
     </ul>
   </div>
</nav>

  )
}

export default NavBar