import FormPage from "./pages/FormPage.jsx";
import AppRoutes from "./pages/AppRoutes.jsx";
import { Routes, Route } from "react-router-dom";
import Designpage from "./pages/Designpage.jsx";
import Editpage from "./pages/Editpage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
function App() {
  return (
    <Routes>
      <Route path="/" element={<FormPage />} />
      <Route path="/login" element={<FormPage />} />
      <Route path="/home/*" element={<AppRoutes />} />
      <Route path="/design/*" element={<Designpage />} />
      <Route path="/edit/*" element={<Editpage />} />
      <Route path="/payment/*" element={<PaymentPage />} />
    </Routes>
  );
}

export default App;
