import { Routes, Route } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar.jsx';
import PaymentNavbar from '../components/PaymentNavbar.jsx';
import OrderSummary from './OrderSummary.jsx';
import TandC from './TandC.jsx';
import Account from './Account.jsx';
import DesignTips from './DesignTips.jsx';
function PaymentPage() {
  return (
    <>
      <TopNavbar />
      <div className="d-flex" style={{ height: '100vh' }}>
        <div style={{ width: '250px',height:"100%" }}>
          <PaymentNavbar />
        </div>
        <div className="flex-grow-1 p-4 bg-light overflow-auto">
          <Routes>
            <Route path="/" element={<OrderSummary/>} />
            <Route path="address" element={<Account />} />
            <Route path="tandc" element={<TandC />} />
            <Route path="help" element={<DesignTips />} />
          </Routes>
        </div>
      </div>
    </>
  );
}

export default PaymentPage;
