import { NavLink } from 'react-router-dom';
import { FaUser, FaHome, FaTh, FaPencilAlt, FaShoppingBag, FaSearchLocation } from 'react-icons/fa';
import { MdContactSupport } from "react-icons/md";
import 'bootstrap/dist/css/bootstrap.min.css';

function Sidebar() {
  return (
    <div className="bg-dark text-white p-4" style={{ width: '250px', height: '100vh' }}>
     
      <ul className="nav flex-column ">
        <li className="nav-item p-2">
          <NavLink to="/home" className={({ isActive }) => `nav-link ${!isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <FaHome size={25}/> Home
          </NavLink>
        </li>
        <li className="nav-item p-2">
          <NavLink to="/home/account" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <FaUser size={25}/> Account
          </NavLink>
        </li>
        <li className="nav-item p-2">
          <NavLink to="/home/templates" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <FaTh size={25}/> Templates
          </NavLink>
        </li>
        <li className="nav-item p-2">
          <NavLink to="/home/history" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <FaPencilAlt size={25}/>   History
          </NavLink>
        </li>
        <li className="nav-item p-2">
          <NavLink to="/home/support" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <MdContactSupport size={25}/> Support
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
