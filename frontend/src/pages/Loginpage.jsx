import './createaccount.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginAccount() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Login successful:', data);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.table(localStorage)
        navigate("/home");
         
      } else {
        setErrorMsg(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-account-container">
      <div className="create-account-card">
        <h4 className="subtitle">WELCOME BACK</h4>
        <h1 className="title">Log in to your Account</h1>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your login email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your login password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

          <div
            className="d-flex"
            style={{ justifyContent: 'space-between', marginBottom: '10px' }}
          >
            <div>
              <input type="checkbox" id="remember" />
              <label htmlFor="remember" style={{ marginLeft: '5px' }}>
                Remember me
              </label>
            </div>
            <div>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ textDecoration: 'none', color: '#0066ff' }}
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Logging in...' : 'CONTINUE'}
          </button>
        </form>

        <div className="social-login">
          <p className="divider">or sign in with</p>
          <div className="social-buttons">
            <button type="button" className="social-button google">
              Sign in with Google
            </button>
            <button type="button" className="social-button facebook">
              Sign in with Facebook
            </button>
            <button type="button" className="social-button apple">
              Sign in with Apple
            </button>
          </div>
        </div>

        <p className="create_para">
          New User? <Link to="/">SIGN UP HERE</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginAccount;
