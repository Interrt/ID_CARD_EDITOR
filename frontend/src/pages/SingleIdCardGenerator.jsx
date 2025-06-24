import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom"; // for navigation
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { setEditedCount } from "../redux/counterSlice"; // adjust path as needed

export default function SingleIdCardWithHistory() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // for programmatic navigation

  // --------- Form state ---------
  const [currentFormData, setCurrentFormData] = useState({
    name: "",
    role: "",
    idnumber: "",
    companyname: "",
    bloodgroup: "",
    emailid: "",
    doorNo: "",
    street: "",
    location: "",
    district: "",
  });
  const [currentUserImageSrc, setCurrentUserImageSrc] = useState(null);
  const fileInputRef = useRef(null);
  const [allPersonsData, setAllPersonsData] = useState([]); // { formData, imageSrc }
  const [generatedCardsSvgs, setGeneratedCardsSvgs] = useState([]); // { frontSvg, backSvg }
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showGeneratedSection, setShowGeneratedSection] = useState(false);

  // SVG Templates from Redux
  const svgFront = useSelector((state) => state.svg.svgTemplateFront);
  const svgBack = useSelector((state) => state.svg.svgTemplateBack);

  // --------- Effect to warn if SVG templates are missing ---------
  useEffect(() => {
    if (!svgFront) console.warn("svgFront not loaded");
    if (!svgBack) console.warn("svgBack not loaded");
  }, [svgFront, svgBack]);

  // --------- Handle form input change ---------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --------- Handle image upload ---------
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCurrentUserImageSrc(evt.target.result);
      };
      reader.onerror = (err) => {
        console.error("Error reading image", err);
        alert("Failed to read image");
      };
      reader.readAsDataURL(file);
    } else {
      setCurrentUserImageSrc(null);
    }
  };

  // --------- Clear form ---------
  const clearCurrentForm = () => {
    setCurrentFormData({
      name: "",
      role: "",
      idnumber: "",
      companyname: "",
      bloodgroup: "",
      emailid: "",
      doorNo: "",
      street: "",
      location: "",
      district: "",
    });
    setCurrentUserImageSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --------- Add person to list ---------
  const handleAddPerson = () => {
    if (!currentUserImageSrc) {
      alert("Upload image");
      return;
    }
    if (!currentFormData.name && !currentFormData.idnumber) {
      alert("Enter Name or ID");
      return;
    }
    const newData = {
      formData: {
        ...currentFormData,
        isEdited: true, // assuming edited if data is filled
      },
      imageSrc: currentUserImageSrc,
    };
    setAllPersonsData((prev) => [...prev, newData]);
    clearCurrentForm();
    setShowGeneratedSection(false);
    setGeneratedCardsSvgs([]);
  };

  // --------- SVG update with data ---------
  const updateSvg = (svgString, dataRow, imageDataUrl) => {
    if (!svgString) return "";
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) return svgString;

    Object.entries(dataRow).forEach(([key, value]) => {
      if (key !== "isEdited") {
        const el = svg.querySelector(`#${key}`);
        if (el) el.textContent = String(value);
      }
    });

    if (imageDataUrl) {
      const userImageEl = svg.getElementById("userImage");
      if (userImageEl && userImageEl.tagName === "image") {
        userImageEl.setAttribute("href", imageDataUrl);
        if (!userImageEl.hasAttribute("width"))
          userImageEl.setAttribute("width", "100");
        if (!userImageEl.hasAttribute("height"))
          userImageEl.setAttribute("height", "100");
        if (!userImageEl.hasAttribute("x")) userImageEl.setAttribute("x", "0");
        if (!userImageEl.hasAttribute("y")) userImageEl.setAttribute("y", "0");
      }
    }
    return new XMLSerializer().serializeToString(svg);
  };

  // --------- Generate all cards ---------
  const handleGenerateAllCards = () => {
    if (allPersonsData.length === 0) {
      alert("Add persons");
      return;
    }
    if (!svgFront || !svgBack) {
      alert("Load SVG templates");
      return;
    }

    // Count IDs marked for editing
    const editedIdsCount = allPersonsData.filter((p) => p.formData.isEdited).length;
    // Dispatch count to Redux
    dispatch(setEditedCount(editedIdsCount));

    const generated = allPersonsData.map((p) => ({
      frontSvg: updateSvg(svgFront, p.formData, p.imageSrc),
      backSvg: updateSvg(svgBack, p.formData, p.imageSrc),
    }));
    setGeneratedCardsSvgs(generated);
    setCurrentCardIndex(0);
    setShowGeneratedSection(true);
    alert(`Generated ${generated.length} cards`);
  };

  // --------- Navigation ---------
  const goNext = () => {
    setCurrentCardIndex((prev) => Math.min(prev + 1, generatedCardsSvgs.length - 1));
  };
  const goPrev = () => {
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
  };
  const currentCard = generatedCardsSvgs[currentCardIndex];

  // --------- Save all ID cards to history (ZIP) ---------
  const handleSaveToHistory = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      alert("User not logged in");
      return;
    }
    const zip = new JSZip();

    for (let index = 0; index < generatedCardsSvgs.length; index++) {
      const card = generatedCardsSvgs[index];
      const personData = allPersonsData[index]?.formData || {};
      const cardName =
        personData.name || personData.idnumber || `card_${index + 1}`;

      const frontDiv = document.createElement("div");
      frontDiv.style.width = "170px";
      frontDiv.style.height = "270px";
      frontDiv.innerHTML = card.frontSvg;

      const backDiv = document.createElement("div");
      backDiv.style.width = "170px";
      backDiv.style.height = "270px";
      backDiv.innerHTML = card.backSvg;

      document.body.appendChild(frontDiv);
      document.body.appendChild(backDiv);

      try {
        const frontCanvas = await html2canvas(frontDiv, { useCORS: true, scale: 2 });
        const backCanvas = await html2canvas(backDiv, { useCORS: true, scale: 2 });
        const frontBlob = await new Promise((res) => frontCanvas.toBlob(res, "image/png"));
        const backBlob = await new Promise((res) => backCanvas.toBlob(res, "image/png"));

        if (frontBlob) zip.file(`${cardName}_front.png`, frontBlob);
        if (backBlob) zip.file(`${cardName}_back.png`, backBlob);
      } catch (err) {
        console.error("Error generating images for card:", err);
      } finally {
        if (document.body.contains(frontDiv)) document.body.removeChild(frontDiv);
        if (document.body.contains(backDiv)) document.body.removeChild(backDiv);
      }
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    const formData = new FormData();
    formData.append("file", zipBlob, "design.zip");
    formData.append("userId", user._id);
    try {
      await fetch("http://localhost:3000/save-history", {
        method: "POST",
        body: formData,
      });
      alert("All ID cards saved to history");
    } catch (err) {
      console.error("Error saving to history:", err);
      alert("Failed to save to history");
    }
  };

  // --------- Generate ZIP for current card ---------
  const generateZipForCurrentCard = async () => {
    const frontSvgStr = currentCard?.frontSvg;
    const backSvgStr = currentCard?.backSvg;
    if (!frontSvgStr || !backSvgStr) return null;

    const frontDiv = document.createElement("div");
    frontDiv.style.width = "170px";
    frontDiv.style.height = "270px";
    frontDiv.innerHTML = frontSvgStr;

    const backDiv = document.createElement("div");
    backDiv.style.width = "170px";
    backDiv.style.height = "270px";
    backDiv.innerHTML = backSvgStr;

    document.body.appendChild(frontDiv);
    document.body.appendChild(backDiv);

    try {
      const frontCanvas = await html2canvas(frontDiv, { useCORS: true, scale: 2 });
      const backCanvas = await html2canvas(backDiv, { useCORS: true, scale: 2 });
      const frontBlob = await new Promise((res) => frontCanvas.toBlob(res, "image/png"));
      const backBlob = await new Promise((res) => backCanvas.toBlob(res, "image/png"));

      const zip = new JSZip();
      const personData = allPersonsData[currentCardIndex]?.formData || {};
      const cardName = personData.name || personData.idnumber || `card_${currentCardIndex + 1}`;
      if (frontBlob) zip.file(`${cardName}_front.png`, frontBlob);
      if (backBlob) zip.file(`${cardName}_back.png`, backBlob);
      return await zip.generateAsync({ type: "blob" });
    } catch (error) {
      console.error("Error generating zip", error);
      throw error;
    } finally {
      if (document.body.contains(frontDiv)) document.body.removeChild(frontDiv);
      if (document.body.contains(backDiv)) document.body.removeChild(backDiv);
    }
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9f9f9",
  };

  // --------- Get the edited count from Redux ---------
  const editedCount = useSelector((state) => state.editedCount.editedCount);

  // --------- Handle "OrderNow" button click ---------
  const handleOrderNow = () => {
    // Pass the editedCount via state
    navigate('/payment', { state: { editedCount } });
  };

  // --------- JSX ---------
  return (
    <div style={containerStyle}>
      <div >
        <div style={{fontFamily: "Arial",padding:"20px" }}>
          {/* Your existing form and controls */}
          <div
            className="m-5 p-5 shadow-lg d-flex flex-column align-items-center"
            style={{ borderRadius: "20px", maxWidth: "800px", margin: "auto" }}
          >
            <h2 className="mb-4 text-center">Add Person Details</h2>
            {/* Form Inputs */}
            <div className="row g-3 w-100 mb-4">
              {Object.keys(currentFormData).map((key) => (
                <div className="col-md-6" key={key}>
                  <label htmlFor={key} className="form-label">
                    {key.charAt(0).toUpperCase() +
                      key
                        .slice(1)
                        .replace(/([A-Z])/g, " $1")
                        .trim()}
                    :
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={key}
                    name={key}
                    value={currentFormData[key]}
                    onChange={handleChange}
                    placeholder={`Enter ${key
                      .replace(/([A-Z])/g, " $1")
                      .toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            {/* Image Upload */}
            <div className="mb-4 w-100">
              <label htmlFor="userPhoto" className="form-label">
                Upload Photo:
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleImageUpload}
                ref={fileInputRef}
              />
              {currentUserImageSrc && (
                <div className="mt-2 text-center">
                  <p
                    style={{
                      fontSize: "0.9em",
                      color: "green",
                      marginBottom: "5px",
                    }}
                  >
                    Image Loaded:
                  </p>
                  <img
                    src={currentUserImageSrc}
                    alt="Preview"
                    style={{
                      maxWidth: "100px",
                      maxHeight: "100px",
                      borderRadius: "5px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>
              )}
            </div>

            {/* Buttons for adding persons and generating cards */}
            <button
              className="btn btn-success m-2"
              onClick={handleAddPerson}
              style={{ padding: "10px 30px", fontSize: "1.1em" }}
            >
              Add Person ({allPersonsData.length})
            </button>
            <button
              className="btn btn-primary m-2"
              disabled={allPersonsData.length === 0}
              onClick={handleGenerateAllCards}
              style={{ padding: "10px 30px", fontSize: "1.1em" }}
            >
              Generate All ID Cards ({allPersonsData.length})
            </button>
          </div>

          {/* Show generated cards */}
          {showGeneratedSection && generatedCardsSvgs.length > 0 && (
            <div style={{ marginTop: "2rem", textAlign: "center" }}>
              <h2>Generated ID Cards</h2>
              <p>
                Card {currentCardIndex + 1} of {generatedCardsSvgs.length}
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  justifyContent: "center",
                }}
              >
                {/* Front */}
                <div
                  style={{
                    width: 170,
                    height: 270,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: currentCard?.frontSvg || "",
                  }}
                />
                {/* Back */}
                <div
                  style={{
                    width: 170,
                    height: 270,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                  dangerouslySetInnerHTML={{
                    __html: currentCard?.backSvg || "",
                  }}
                />
              </div>
              {/* Navigation buttons */}
              <div className="mt-3 d-flex justify-content-center gap-3">
                <button
                  className="btn btn-secondary"
                  onClick={goPrev}
                  disabled={currentCardIndex === 0}
                >
                  Previous
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={goNext}
                  disabled={currentCardIndex === generatedCardsSvgs.length - 1}
                >
                  Next
                </button>
                {/* Save to history */}
                <button className="btn btn-primary" onClick={handleSaveToHistory}>Save</button>
                <button className="btn btn-info" onClick={()=>{handleOrderNow();handleSaveToHistory()}}>
                  Order Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}