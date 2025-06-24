import { Routes, Route, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import TopNavbar from '../components/TopNavbar.jsx';
import EditNavbar from '../components/EditNavbar.jsx';
import DesignHistory from './DesignHistory.jsx';
import Svgedit from './Svgedit.jsx';
import DesignTips from './DesignTips.jsx';

function Editpage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?._id;

  // Get modelName from URL
  const { modelName } = useParams();

  // Store in localStorage if needed
  useEffect(() => {
    if (modelName) {
      localStorage.setItem('modelName', modelName);
    }
  }, [modelName]);

  return (
    <>
      <TopNavbar />
      <div className="d-flex" style={{ height: '100vh' }}>
        <div style={{ width: '250px', height: '100%' }}>
          <EditNavbar modelName={modelName} />
        </div>
        <div className="flex-grow-1 bg-light overflow-auto">
          <Routes>
            <Route path="/:modelName" element={<Svgedit />} />
            <Route path="history" element={<DesignHistory userId={userId} />} />
            <Route path="help" element={<DesignTips />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default Editpage;
