import image1 from "/assets/Front.png";
import image2 from "/assets/Front1.png";
import image3 from "/assets/Front2.png";
import image4 from "/assets/Front3.png";
import './createaccount.css';

const ImgStyle = () => {
  const imageStyleBase = {
    position: "absolute",
    width: "200px",
    borderRadius: "40px",
    zIndex: 0,
    
  };

  return (
    <div className="img_position"
      style={{
        backgroundColor: "#e6e5e5",
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <img
        src={image1}
        alt="Rotated 1"
        style={{
          ...imageStyleBase,
          transform: "rotate(-18deg) translate(-30px, 10px)",
        }}
      />
      <img
        src={image2}
        alt="Rotated 2"
        style={{
          ...imageStyleBase,
          transform: "rotate(6deg) translate(180px, -10px)",
        }}
      />
      <img
        src={image3}
        alt="Rotated 3"
        style={{
          ...imageStyleBase,
          transform: "translate(-50px, 300px) rotate(14deg)",
        }}
      />
      <img
        src={image4}
        alt="Rotated 4"
        style={{
          ...imageStyleBase,
          transform: "translate(180px, 300px) rotate(-13deg)",
        }}
      />
    </div>
  );
};

export default ImgStyle;
