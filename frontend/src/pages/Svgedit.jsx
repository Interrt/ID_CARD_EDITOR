import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import html2canvas from "html2canvas";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import getCroppedImg from "./cropUtils";
import "./cardedit.css";
import "./designlist.css";
import SvgExcel from "./SvgExcel";
import { useDispatch } from "react-redux";
import { setSvgTemplate, setSvgFront, setSvgBack } from "../redux/userSlice";
import SingleIdCardGenerator from "./SingleIdCardGenerator";
import Svgmodels from "./Svgmodels";
export default function Svgedit() {
  const { modelName } = useParams(); 
  const navigate = useNavigate(); 
  const dispatch = useDispatch();

  const [frontSvgContent, setFrontSvgContent] = useState("");
  const [backSvgContent, setBackSvgContent] = useState("");
  const [currentSide, setCurrentSide] = useState("front");
  const [isFront, setIsFront] = useState(true);

  // --- FETCH SVGS FROM SERVER BASED ON MODEL NAME ---
  useEffect(() => {
    if (!modelName) {
      console.error("Model name not provided in URL");
      return;
    }

    fetch(`http://localhost:3000/svgmodel/${modelName}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch SVGs: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setFrontSvgContent(data.frontSvg);
        setBackSvgContent(data.backSvg);
        dispatch(setSvgFront(data.frontSvg));
        dispatch(setSvgBack(data.backSvg));
      })
      .catch((err) => {
        console.error("Error fetching SVGs:", err);
      });
  }, [modelName, dispatch]);

  // Text fields
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [id, setId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [emailId, setEmailId] = useState("");
  const [doorNo, setDoorNo] = useState("");
  const [street, setStreet] = useState("");
  const [location, setLocation] = useState("");
  const [district, setDistrict] = useState("");

  // Colors and font
  const [bgColor, setBgColor] = useState("#000");
  const [textColor, setTextColor] = useState("#000");
  const [fontFamily, setFontFamily] = useState("Montserrat, sans-serif");

  const svgRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- REDUX DISPATCH FIXES ---
  useEffect(() => {
    dispatch(setSvgFront(frontSvgContent));
  }, [frontSvgContent, dispatch]);

  useEffect(() => {
    dispatch(setSvgBack(backSvgContent));
  }, [backSvgContent, dispatch]);
  // --- END REDUX FIXES ---

  // Modal and preview
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Image upload and cropping
  const [uploadedImage, setUploadedImage] = useState(null);
  const [croppingMode, setCroppingMode] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const [selectedTab, setSelectedTab] = useState("text");
  const [tab, setTab] = useState("Design");

  // --- UPDATE SVG CONTENT ---
  const updateSvgContent = (svgString, modifications) => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, "image/svg+xml");
      const svgEl = doc.querySelector("svg");
      if (!svgEl) {
        console.error("No <svg> element found in SVG content");
        return svgString;
      }

      // Update text elements
      Object.entries(modifications.texts || {}).forEach(([id, value]) => {
        const el = svgEl.getElementById(id);
        if (el) {
          el.textContent = value;
        }
      });

      // Update text and background colors
      const allTextEls = svgEl.querySelectorAll("text");
      allTextEls.forEach((textEl) => {
        if (modifications.textColor) {
          textEl.setAttribute("fill", modifications.textColor);
        }
        if (modifications.fontFamily) {
          textEl.setAttribute("font-family", modifications.fontFamily);
        }
      });

      if (modifications.bgIds && modifications.bgColor) {
        modifications.bgIds.forEach((id) => {
          const el = svgEl.getElementById(id);
          if (el) {
            el.setAttribute("fill", modifications.bgColor);
          }
        });
      }

      // --- IMAGE EMBEDDING ---
      if (modifications.uploadedImage) {
        const userImagePlaceholder = svgEl.getElementById("userImage");
        if (userImagePlaceholder) {
          let x, y, width, height;

          if (userImagePlaceholder.tagName === "image") {
            x = parseFloat(userImagePlaceholder.getAttribute("x") || 0);
            y = parseFloat(userImagePlaceholder.getAttribute("y") || 0);
            width = parseFloat(userImagePlaceholder.getAttribute("width") || 0);
            height = parseFloat(
              userImagePlaceholder.getAttribute("height") || 0
            );
          } else {
            const bbox = userImagePlaceholder.getBBox
              ? userImagePlaceholder.getBBox()
              : null;
            if (bbox) {
              x = bbox.x;
              y = bbox.y;
              width = bbox.width;
              height = bbox.height;
            } else if (userImagePlaceholder.tagName === "rect") {
              x = parseFloat(userImagePlaceholder.getAttribute("x"));
              y = parseFloat(userImagePlaceholder.getAttribute("y"));
              width = parseFloat(userImagePlaceholder.getAttribute("width"));
              height = parseFloat(userImagePlaceholder.getAttribute("height"));
            } else if (userImagePlaceholder.tagName === "circle") {
              const cx = parseFloat(userImagePlaceholder.getAttribute("cx"));
              const cy = parseFloat(userImagePlaceholder.getAttribute("cy"));
              const r = parseFloat(userImagePlaceholder.getAttribute("r"));
              x = cx - r;
              y = cy - r;
              width = r * 2;
              height = r * 2;
            } else {
              x = 0;
              y = 0;
              width = 100;
              height = 100; // fallback
            }
          }

          let imageEl = svgEl.getElementById("userImage");
          if (!imageEl || imageEl.tagName !== "image") {
            imageEl = document.createElementNS(
              "http://www.w3.org/2000/svg",
              "image"
            );
            imageEl.setAttribute("id", "userImage");
            if (userImagePlaceholder.hasAttribute("clip-path")) {
              imageEl.setAttribute(
                "clip-path",
                userImagePlaceholder.getAttribute("clip-path")
              );
            }
            if (userImagePlaceholder.parentNode) {
              userImagePlaceholder.parentNode.replaceChild(
                imageEl,
                userImagePlaceholder
              );
            } else {
              svgEl.appendChild(imageEl);
            }
          }

          // Set image attributes
          imageEl.setAttribute("href", modifications.uploadedImage);
          imageEl.setAttribute("x", x);
          imageEl.setAttribute("y", y);
          imageEl.setAttribute("width", width);
          imageEl.setAttribute("height", height);
          imageEl.setAttribute("preserveAspectRatio", "xMidYMid slice");
        } else {
          console.warn(`Element with id "userImage" not found in SVG.`);
        }
      }
      // --- END IMAGE EMBED ---

      return new XMLSerializer().serializeToString(svgEl);
    } catch (error) {
      console.error("Error updating SVG:", error);
      return svgString;
    }
  };
  // --- END UPDATE FUNCTION ---

  // Preview
  const handlePreview = async () => {
    if (!svgRef.current) return;
    const canvas = await html2canvas(svgRef.current, {
      useCORS: true,
      backgroundColor: null,
    });
    const imgData = canvas.toDataURL("image/png");
    setPreviewImage(imgData);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setPreviewImage(null);
  };

  const handleSaveSvg = () => {
    const svgString = getCurrentStyledSVG();
    dispatch(setSvgTemplate(svgString));
    navigate("/addmember");
    alert("Svg will be saved");
  };

  const getCurrentStyledSVG = () => {
    const svgEl = svgRef.current?.querySelector("svg");
    return svgEl ? new XMLSerializer().serializeToString(svgEl) : "";
  };

  // Image upload handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(URL.createObjectURL(file));
      setCroppingMode(true);
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const showCroppedImage = async () => {
    try {
      const croppedImage = await getCroppedImg(
        uploadedImage,
        croppedAreaPixels
      );
      setUploadedImage(croppedImage);
      setCroppingMode(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Effect to update SVGs when text/color/image changes
  useEffect(() => {
    const modifications = {
      texts: {
        name,
        role,
        idnumber: id,
        companyname: companyName,
        bloodgroup: bloodGroup,
        emailid: emailId,
        doorNo,
        street,
        location,
        district,
      },
      textColor,
      fontFamily,
      bgIds: [
        "bgColor",
        "bgColor1",
        "bgColor2",
        "bgColor3",
        "bgColor4",
        "bgColor5",
        "bgColor6",
      ],
      bgColor,
      uploadedImage,
    };

    if (currentSide === "front") {
      setFrontSvgContent(updateSvgContent(frontSvgContent, modifications));
    } else {
      setBackSvgContent(updateSvgContent(backSvgContent, modifications));
    }
  }, [
    name,
    role,
    id,
    companyName,
    bloodGroup,
    emailId,
    doorNo,
    street,
    location,
    district,
    bgColor,
    textColor,
    fontFamily,
    uploadedImage,
    currentSide,
  ]);

  const svgToRender =
    currentSide === "front" ? frontSvgContent : backSvgContent;

  return (
    <>
      {/* Additional buttons */}
      <div 
       
        className="btn-group m-5"
        style={{ display: "flex", justifyContent: "center" }}
      >
        <button
          className={`btn btn-info ${tab === "Design" ? "active" : ""}`}
          onClick={() => setTab("Design")}
        >
          ID_Editor
        </button>
        <button
          className={`btn btn-info ${tab === "SingleEdit" ? "active" : ""}`}
          onClick={() => setTab("SingleEdit")}
        >
          Single_ID_Edit
        </button>
        <button
          className={`btn btn-info ${tab === "BulkEdit" ? "active" : ""}`}
          onClick={() => setTab("BulkEdit")}
        >
          Bulk_ID_Edit
        </button>
      </div>
      <div>
        {tab === "Design" && (
          <div className="editor-container" style={{ display: "flex" }}>
            {/* Card preview */}
            <div className="card-preview-area" style={{ flex: 1, padding: "1rem" }}>
              {/* SVG preview */}
              <div
                className="id-card mb-3"
                ref={svgRef}
                style={{ width: 250, height: 400 }}
                dangerouslySetInnerHTML={{ __html: svgToRender }}
              />

              {/* Side toggle buttons */}
              <div className="card-toggle-buttons mb-2">
                <button
                  onClick={() => {
                    setIsFront(true);
                    setCurrentSide("front");
                  }}
                  className={`btn btn-primary mx-2 ${isFront ? "active" : ""}`}
                >
                  Front
                </button>
                <button
                  onClick={() => {
                    setIsFront(false);
                    setCurrentSide("back");
                  }}
                  className={`btn btn-primary mx-2 ${!isFront ? "active" : ""}`}
                >
                  Back
                </button>
              </div>
              {/* Preview button */}
              <button className="btn btn-primary mx-2" onClick={handlePreview}>
                👁 Preview
              </button>

              {/* Preview Modal */}
              {showModal && (
                <div
                  className="modal-backdrop"
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 9999,
                  }}
                >
                  <div
                    className="modal-content"
                    style={{
                      background: "#fff",
                      padding: 20,
                      borderRadius: 8,
                      maxWidth: "90%",
                      maxHeight: "80%",
                      overflow: "auto",
                      position: "relative",
                    }}
                  >
                    <button
                      className="modal-close"
                      onClick={closeModal}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: "none",
                        border: "none",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                      }}
                    >
                      ×
                    </button>
                    <h2 className="modal-title">Preview Template</h2>
                    <img
                      src={previewImage}
                      alt="Preview"
                      style={{
                        width: "100%",
                        maxHeight: "60vh",
                        objectFit: "contain",
                      }}
                    />
                    <div
                      className="modal-footer"
                      style={{ marginTop: 10, textAlign: "center" }}
                    >
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={closeModal}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Customize panel */}
            <div
              className="customize-panel"
              style={{
                maxWidth: 500,
                padding: 30,
                borderRadius: 8,
                marginLeft: "1rem",
              }}
            >
              <h2 className="text-center">Customize</h2>
              {/* Tab buttons */}
              <div
                className="btn-group mb-3"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <button
                  className={`btn btn-primary ${selectedTab === "text" ? "active" : ""}`}
                  onClick={() => setSelectedTab("text")}
                >
                  Text
                </button>
                <button
                  className={`btn btn-primary ${selectedTab === "image" ? "active" : ""}`}
                  onClick={() => setSelectedTab("image")}
                >
                  Image
                </button>
                <button
                  className={`btn btn-primary ${selectedTab === "color" ? "active" : ""}`}
                  onClick={() => setSelectedTab("color")}
                >
                  Color
                </button>
              </div>

              {/* Text tab */}
              {selectedTab === "text" && (
                <div>
                  <div className="form-group m-3" style={{ width: "300px" }}>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your Job Role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your ID"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your Company Name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your Blood Group"
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your Email ID"
                      value={emailId}
                      onChange={(e) => setEmailId(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your Door Number"
                      value={doorNo}
                      onChange={(e) => setDoorNo(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your Street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Enter your District"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Image tab */}
              {selectedTab === "image" && (
                <div className="form-group text-center m-5">
                  {!uploadedImage && (
                    <>
                      <button
                        className="btn btn-primary mb-2"
                        onClick={() => fileInputRef.current.click()}
                      >
                        📤 Upload Image
                      </button>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                      />
                    </>
                  )}

                  {uploadedImage && croppingMode && (
                    <>
                      <div
                        style={{ position: "relative", width: "100%", height: 300 }}
                      >
                        <Cropper
                          image={uploadedImage}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          cropShape="round"
                          showGrid={false}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={onCropComplete}
                        />
                      </div>
                      <Slider
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e, value) => setZoom(value)}
                      />
                      <button
                        className="btn btn-success mt-2"
                        onClick={showCroppedImage}
                      >
                        ✂️ Confirm Crop
                      </button>
                    </>
                  )}

                  {uploadedImage && !croppingMode && (
                    <>
                      <img
                        src={uploadedImage}
                        alt="Cropped Preview"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px dashed #ccc",
                          marginTop: 10,
                        }}
                      />
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => setCroppingMode(true)}
                      >
                        Crop
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Color tab */}
              {selectedTab === "color" && (
                <div className="form-group my-5">
                  <label>Pick your Design Color:</label>
                  <input
                    type="color"
                    className="form-control mb-2"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                  <label className="pt-5">Select your Text Color:</label>
                  <input
                    type="color"
                    className="form-control mb-2"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                  />
                  <label className="pt-5">Select your Font Style:</label>
                  <select
                    className="form-control mb-2"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    <option value="Montserrat, sans-serif">Montserrat</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Times New Roman, serif">Times New Roman</option>
                    <option value="Courier New, monospace">Courier New</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
        {tab === "SingleEdit" && <SingleIdCardGenerator />}
        {tab === "BulkEdit" && <SvgExcel />}
      </div>
      <div className="text-center my-4">
        <h2>SVG Models</h2>
        <div className="p-5">
          <Svgmodels />
        </div>
      </div>
      
    </>
  );
}