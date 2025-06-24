import { NavLink } from 'react-router-dom';
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { TiArrowBackOutline } from "react-icons/ti";
import { IoMdTime } from "react-icons/io";
import { CiBoxList } from "react-icons/ci";
import 'bootstrap/dist/css/bootstrap.min.css';


function DesignNavbar() {
     return (
    <div className="bg-dark text-white p-3" style={{ width: '250px', height: '100vh' }}>
      
      <ul className="nav flex-column">
        <li className="nav-item py-3">
          <NavLink to="/design" className={({ isActive }) => `nav-link ${!isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <CiBoxList size={30}/> Design List
          </NavLink>
        </li>
        
        <li className="nav-item py-3">
          <NavLink to="/design/recent" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <IoMdTime size={30}/> Recents
          </NavLink>
        </li>
        <li className="nav-item py-3">
          <NavLink to="/design/designtips" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <MdOutlineTipsAndUpdates size={30} /> Design Tips
          </NavLink>
        </li>
        
        <li className="nav-item py-3">
          <NavLink to="/home" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <TiArrowBackOutline size={30} /> Back
          </NavLink>
        </li>
        
      </ul>
    </div>
  );

  
}

export default DesignNavbar

