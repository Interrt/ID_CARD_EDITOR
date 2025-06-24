import { Link } from 'react-router-dom';
import { CiLogout } from "react-icons/ci"
import './TopNavbar.css';

function TopNavbar() {
  return (
    <div className="top-navbar d-flex justify-content-between align-items-center px-4 py-2">
      <div className="logo text-white fw-bold fs-4">
        <Link to="/home" className="text-white text-decoration-none">
          <span className="logo-icon me-2">🪪</span>Cardify
        </Link>
      </div>

      <div className="nav-icons d-flex gap-4">
        <Link to="/home" className="text-white">
          <CiLogout size={25} />
        </Link>
      </div>
    </div>
  );
}

export default TopNavbar;
