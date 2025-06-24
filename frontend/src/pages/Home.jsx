import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import DesignHistory  from './DesignHistory'
const Home = () => {
  const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;
const username = user ? user.name : 'Guest';
const userId = user ? user._id : null;
  return (
    

    <div className="p-4">
      <h1 className="fw-bold">Hello, {username}!!</h1>
      <p className="text-muted fs-5">
        Let’s get started on crafting stunning ID cards — your creativity meets our templates<br />
        Pick up where you left off or start something new today!
      </p>

      <div className="d-flex gap-4 mt-4 flex-wrap">
        <Link to="/home/templates">
        <button className="btn btn-outline-primary btn-lg d-flex align-items-center px-4 py-3 rounded-4">
          <FaPlus size={32} className="me-3 bg-light p-2 rounded-2 " />
          <span className="">Create New ID</span>
        </button>
        </Link>

        <Link to="/design">
        <button className="btn btn-outline-primary btn-lg d-flex align-items-center px-4 py-3 rounded-4">
          <FaPlus size={32} className="me-3 bg-light p-2 rounded-2" />
          <span className="fs-5 fw-semibold">Explore Templates</span>
        </button>
        </Link>
        
      </div>

      <h4 className="mt-5 fw-bold">My Recent Activity</h4>
      <DesignHistory userId={userId} />
    </div>
  
    
  );
};

export default Home;

