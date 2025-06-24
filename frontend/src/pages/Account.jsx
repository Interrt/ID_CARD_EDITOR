import React, { useState } from 'react';

function Account() {
  const [formData, setFormData] = useState({
    name: '',
    address1: '',
    address2: '',
    mobileNumber: '',
    email: '',
    state: '',
    city: '',
    pincode: '',
    country: ''
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    let userId = 0;
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      userId = user._id;
    }

    if (!userId) {
      setError('User not logged in!');
      setLoading(false);
      return;
    }

    const payload = { ...formData, userId };

    try {
      const response = await fetch('http://localhost:3000/user/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to create order');
      }

      await response.json();
      alert('Order created successfully!');
      setFormData({
        name: '',
        address1: '',
        address2: '',
        mobileNumber: '',
        email: '',
        state: '',
        city: '',
        pincode: '',
        country: ''
      });
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const username = user ? user.name : 'Guest';

  return (
    <div className="p-4">
      <h2 className="fw-bold mb-4">Hello,{username}!</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div>Loading...</div>}

      <form className="row g-3" onSubmit={handleSubmit}>
        {/* Your input fields here... */}
        <div className="col-md-6">
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        {/* Repeat for all inputs */}
        <div className="col-md-6">
          <input
            type="text"
            name="address1"
            className="form-control"
            placeholder="Address Line 1"
            value={formData.address1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="mobileNumber"
            className="form-control"
            placeholder="Mobile Number"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="address2"
            className="form-control"
            placeholder="Address Line 2"
            value={formData.address2}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <input
            type="text"
            name="state"
            className="form-control"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="city"
            className="form-control"
            placeholder="City / Town"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            name="pincode"
            className="form-control"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-3">
          <input
            type="text"
            name="country"
            className="form-control"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            required
          />
        </div>

        <input className="col-md-4 btn btn-primary align-center" type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default Account;
