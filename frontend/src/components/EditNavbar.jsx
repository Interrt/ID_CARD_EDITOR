import { NavLink } from 'react-router-dom';
import { FaRegSave } from 'react-icons/fa';
import { MdOutlineLiveHelp } from "react-icons/md";
import { TiArrowBackOutline } from "react-icons/ti";
import { RiImageEditFill } from "react-icons/ri";
import 'bootstrap/dist/css/bootstrap.min.css';

function EditNavbar({ modelName }) {
  return (
    <div className="bg-dark text-white p-3" style={{ width: '250px', height: '100vh' }}>
      <ul className="nav flex-column">
        <li className="nav-item py-3">
          <NavLink
            to="/edit/M3"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`
            }
          >
            <RiImageEditFill size={30} /> Edit
          </NavLink>
        </li>

        <li className="nav-item py-3">
          <NavLink
            to="/edit/history"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`
            }
          >
            <FaRegSave size={30} /> History
          </NavLink>
        </li>

        <li className="nav-item py-3">
          <NavLink
            to="/edit/help"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`
            }
          >
            <MdOutlineLiveHelp size={30} /> Help
          </NavLink>
        </li>

        <li className="nav-item py-3">
          <NavLink
            to="/design"
            className={({ isActive }) =>
              `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`
            }
          >
            <TiArrowBackOutline size={30} /> Back
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default EditNavbar;
