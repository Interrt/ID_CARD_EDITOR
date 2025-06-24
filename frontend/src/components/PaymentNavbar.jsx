import { NavLink } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { GrView } from "react-icons/gr";
import { FiEdit } from "react-icons/fi";
import { IoIosInformationCircleOutline } from "react-icons/io";
import { MdOutlineLiveHelp } from "react-icons/md";
function PaymentNavbar() {
     return (
    <div className="bg-dark text-white p-3" style={{ width: '250px', height: '100vh' }}>
      
      <ul className="nav flex-column">
        <li className="nav-item py-3">
          <NavLink to="/payment" className={({ isActive }) => `nav-link ${!isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <GrView size={30} /> Paymant
          </NavLink>
        </li>
        <li className="nav-item py-3">
          <NavLink to="/payment/address" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <FiEdit size={30}/>Edit Address
          </NavLink>
        </li>
        <li className="nav-item py-3">
          <NavLink to="/payment/TandC" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <IoIosInformationCircleOutline size={30} /> T&C
          </NavLink>
        </li>
        <li className="nav-item py-3">
          <NavLink to="/payment/help" className={({ isActive }) => `nav-link ${isActive ? 'bg-secondary text-white' : 'text-white'} fs-5`}>
            <MdOutlineLiveHelp size={30} />Help
          </NavLink>
        </li>
        
      </ul>
    </div>
  );

  
}

export default PaymentNavbar

