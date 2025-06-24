import { useLocation } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import LoginAccount from './Loginpage';
import ImgStyle from './Imgstylepage';
import 'bootstrap/dist/css/bootstrap.min.css';

function FormPage() {
  const location = useLocation();

  return (
    <div className="d-flex" style={{ height: "100vh",display: "flex" }}>
      <div
        style={{
          flex: 1,
          maxWidth: "50%",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ImgStyle />
      </div>
      <div
        style={{
          flex: 1,
          maxWidth: "50%",
          overflowY: "auto",
          padding: "2rem",
          backgroundColor: "#e7e2e2",
        }}
      >
        {location.pathname === '/' && <CreateAccount />}
        {location.pathname === '/login' && <LoginAccount />}
      </div>
    </div>
  );
}

export default FormPage;