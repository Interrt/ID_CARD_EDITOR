import { NavLink } from 'react-router-dom';
import { IoMdPersonAdd } from "react-icons/io";
import { MdOutlineUploadFile } from "react-icons/md";
import { FaList } from "react-icons/fa";
import 'bootstrap/dist/css/bootstrap.min.css';
import { TiArrowBackOutline } from "react-icons/ti";

function AddNavbar() {
     return (
    <div className="bg-dark text-white p-3" style={{ width: '250px', height: '100vh' }}>
      
      <ul className="nav flex-column">
        <li className="nav-item py-3">
          <NavLink to="/addmember" className={({ isActive }) => `nav-link ${!isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <IoMdPersonAdd size={30} /> Add Person
          </NavLink>
        </li>
        <li className="nav-item py-3">
          <NavLink to="/addmember/uplodedmember" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <MdOutlineUploadFile size={30}/> File Uplode
          </NavLink>
        </li>
        <li className="nav-item py-3">
          <NavLink to="/edit" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <TiArrowBackOutline size={30} /> Back
          </NavLink>
        </li>
        
      </ul>
    </div>
  );

  
}

export default AddNavbar

