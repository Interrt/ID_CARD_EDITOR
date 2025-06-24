import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./designlist.css";

const Svgmodels = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const designs = [
    { image: "/assets/Front3.png", modelName: "M1" },
    // { image: "/assets/Front1.png", modelName: "M2" },
    { image: "/assets/Front4.png", modelName: "M3" },
    // { image: "/assets/Front.png", modelName: "M4" },
  ];

  const openModal = (imgSrc) => {
    setPreviewImage(imgSrc);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPreviewImage(null);
  };

  return (
    <div className="row gap-5">
      {designs.map((design, index) => (
        <div className="card" key={index}>
          <img src={design.image} alt={`Design ${index + 1}`} className="card-image" />
          <div className="card-overlay">
            <button onClick={() => openModal(design.image)} className="btn btn-outline-primary">
              Preview
            </button>
            {/* Link navigates to SVG fetch page with modelName */}
            <Link to={`/edit/${design.modelName}`}>
              <button className="btn btn-outline-primary">Use This</button>
            </Link>
          </div>
        </div>
      ))}

      {/* Modal for preview */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button className="modal-close" onClick={closeModal}>×</button>
            <h2 className="modal-title">Preview Template</h2>
            <img src={previewImage} alt="Preview" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Svgmodels;