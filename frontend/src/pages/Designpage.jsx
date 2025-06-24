import { Routes, Route } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar.jsx';
import DesignTips from './DesignTips.jsx';
import DesignNavbar from '../components/DesignNavbar.jsx';
import DesignHistory from './DesignHistory.jsx';
import Svgmodels from './Svgmodels.jsx';
function Designpage() {
   const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  return (
    
    <>
      <TopNavbar />
      <div className="d-flex" style={{ height: '100vh' }}>
        <div style={{ width: '250px',height:"100%" }}>
          <DesignNavbar />
        </div>
        <div className="flex-grow-1 p-4 bg-light overflow-auto">
          <Routes>
            <Route path="/" element={<Svgmodels />} />
            <Route path="recent" element={<DesignHistory userId={userId} />} />
            <Route path="designtips" element={<DesignTips />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Designpage;
