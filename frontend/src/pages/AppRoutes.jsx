import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/SideNavbar.jsx";
import TopNavbar from "../components/TopNavbar.jsx";
import Home from "./Home.jsx";
import Account from "./Account.jsx";
import DesignHistory from "./DesignHistory.jsx";
import Svgmodels from "./Svgmodels.jsx";

function AppRoutes() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  return (
    <>
      <TopNavbar />
      <div className="d-flex" style={{ height: "100vh" }}>
        <div style={{ width: "250px", height: "100%" }}>
          <Sidebar />
        </div>
        <div className="flex-grow-1 p-4 bg-light overflow-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/account" element={<Account />} />
            <Route path="/templates" element={<Svgmodels />} /> 
            <Route
              path="/history"
              element={<DesignHistory userId={userId} />}
            />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default AppRoutes;
