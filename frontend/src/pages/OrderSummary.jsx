import { useSelector } from "react-redux";
const OrderSummary = () => {
  const editedCount = useSelector((state) => state.editedCount.editedCount);

  const handlePay = async () => {
    const options = {
      key: "RAZORPAY_KEY_ID",
      amount:total,
      currency: "INR",
      name: "Test Company",
      description: "Basic Payment",
      handler: (res) => alert("Payment Successful!"),
      prefill: {
        name: "Ayyappan",
        email: "ayyappan@example.com",
        contact: "6379199979",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    
  };
  let count=editedCount
  let cards=count*80
  let gst=Math.round(((cards * 100) / 1000) * 1.8)
  let delivery=50
  let total=cards+gst+delivery

  return (
    <div
      style={{
        display: "flex",
        fontFamily: "Arial, sans-serif",
        maxWidth: "900px",
        margin: "0 auto",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Left Section: ID Card and Summary */}
      <div style={{ flex: 1, backgroundColor: "#e0f7fa", padding: "20px" }}>
        {/* Display the card count */}
        <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
          ID Card Count: {editedCount}
        </div>
        {/* ID Card placeholder */}
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#b2ebf2",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          ID Card
        </div>
        {/* Cards Details */}
        <div style={{ marginTop: "20px" }}>
          <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "8px" }}>Total Cards Edit:  {count}</div>
          <div style={{ fontSize: "14px", marginBottom: "4px" }}>Delivery by :  5days</div>
          <div style={{ fontSize: "14px", marginBottom: "4px" }}>Cards ({count}x80):  {cards}</div>
          <div style={{ fontSize: "14px", marginBottom: "4px" }}>GST (18%):{gst}</div>
          <div style={{ fontSize: "14px", marginBottom: "4px" }}>Delivery Fee:{delivery}</div>
          <hr style={{ margin: "10px 0" }} />
          <div style={{ fontWeight: "bold", fontSize: "16px" }}>Total:{total}</div>
          <button
            style={{
              marginTop: "10px",
              padding: "8px 12px",
              backgroundColor: "#90caf9",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Download GST Invoice
          </button>
        </div>
      </div>

      {/* Right Section: Payment & Address */}
      <div style={{ flex: 1, padding: "20px" }}>
        {/* Delivery Address */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              backgroundColor: "#4db6ac",
              padding: "10px",
              borderRadius: "4px",
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            Delivery Address
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ marginBottom: "20px" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "16px",
              marginBottom: "10px",
            }}
          >
            Payment Method
          </div>
          {/* Payment method selection can go here */}
        </div>

        {/* Input for number (if needed) */}
        <h1>RS:{total}</h1>

        {/* Pay Button */}
        <button
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#0097a7",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "20px",
          }}
          onClick={handlePay}
        >
          PAY NOW
        </button>

        {/* Security info */}
        <div
          style={{
            marginTop: "10px",
            textAlign: "center",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <span>100% Secure Payments by</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;