import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { useSelector, useDispatch } from "react-redux"; // redux hooks
import { useNavigate } from "react-router-dom"; // for navigation
import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { setEditedCount } from "../redux/counterSlice"; 
export default function SvgExcel() {
  const [cardsData, setCardsData] = useState([]);
  const [uploadedImagesMap, setUploadedImagesMap] = useState(new Map());
  const [showGeneratedCards, setShowGeneratedCards] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // SVG templates from redux
  const svgFront = useSelector((state) => state.svg.svgTemplateFront);
  const svgBack = useSelector((state) => state.svg.svgTemplateBack);

  // Get the editedCount once at component render
  const editedCount = useSelector((state) => state.editedCount.editedCount);

  // Log SVG templates
  useEffect(() => {
    if (!svgFront) {
      console.warn("SvgExcel: svgFront template is not yet available in Redux. Please ensure Design component loads and saves it.");
    }
    if (!svgBack) {
      console.warn("SvgExcel: svgBack template is not yet available in Redux. Please ensure Design component loads and saves it.");
    }
    if (svgFront && svgBack) {
      console.log("SvgExcel: SVG templates successfully loaded from Redux.");
    }
  }, [svgFront, svgBack]);

  // Handle Excel upload
  const handleExcelFileUpload = (e) => {
    const [file] = e.target.files;
    if (!file) {
      alert("Please select an Excel file to upload.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
      setCardsData(json);
      setShowGeneratedCards(false);
      console.log(`Excel file '${file.name}' loaded. ${json.length} rows found.`);
    };
    reader.onerror = (error) => {
      console.error("Error reading Excel file:", error);
      alert("Failed to read Excel file. Please try again.");
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle images batch upload
  const handleImageBatchUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImagesMap = new Map();
    let filesProcessed = 0;

    if (files.length === 0) {
      console.log("No image files selected.");
      return;
    }

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (evt) => {
        newImagesMap.set(file.name, evt.target.result);
        filesProcessed++;
        if (filesProcessed === files.length) {
          setUploadedImagesMap((prevMap) => new Map([...prevMap, ...newImagesMap]));
          console.log(`Successfully loaded ${files.length} images.`);
        }
      };
      reader.onerror = (err) => {
        console.error(`Error reading image file '${file.name}':`, err);
        filesProcessed++;
        if (filesProcessed === files.length) {
          setUploadedImagesMap((prevMap) => new Map([...prevMap, ...newImagesMap]));
        }
      };
      reader.readAsDataURL(file);
    });
    setShowGeneratedCards(false);
  };

  // Generate cards display
  const handleGenerateCards = () => {
  if (cardsData.length === 0) {
    alert("Please upload an Excel file with card data first.");
    return;
  }
  if (uploadedImagesMap.size === 0) {
    alert("Please upload a batch of images first.");
    return;
  }
  if (!svgFront || !svgBack) {
    alert("SVG templates are not loaded. Please ensure templates are set in the Design tab and try again.");
    return;
  }

  setShowGeneratedCards(true);
  console.log(`Generating and displaying ${cardsData.length} cards.`);
  dispatch(setEditedCount(cardsData.length)); // ✅ Set the count in Redux
};

  // Function to update SVG with data
  const updateSvg = (svgString, row, currentImageDataMap) => {
    if (!svgString) {
      console.warn("updateSvg: Input SVG string is empty, cannot update.");
      return "";
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svg = doc.querySelector("svg");
    if (!svg) {
      console.warn("updateSvg: No <svg> element found in parsed SVG content. Original string might be invalid.", svgString);
      return svgString;
    }
    Object.entries(row).forEach(([key, value]) => {
      const el = svg.querySelector(`#${key}`);
      if (el) {
        el.textContent = String(value);
      }
    });
    if (currentImageDataMap && currentImageDataMap.size > 0) {
      const excelColumnKeys = Object.keys(row);
      const imageFilenameFromExcel = excelColumnKeys.length > 0 ? row[excelColumnKeys[0]] : null;
      if (imageFilenameFromExcel) {
        const imageDataUrl = currentImageDataMap.get(String(imageFilenameFromExcel));
        if (imageDataUrl) {
          const userImageEl = svg.getElementById("userImage");
          if (userImageEl && userImageEl.tagName === "image") {
            userImageEl.setAttribute("href", imageDataUrl);
            if (!userImageEl.hasAttribute("width")) userImageEl.setAttribute("width", "100");
            if (!userImageEl.hasAttribute("height")) userImageEl.setAttribute("height", "100");
            if (!userImageEl.hasAttribute("x")) userImageEl.setAttribute("x", "0");
            if (!userImageEl.hasAttribute("y")) userImageEl.setAttribute("y", "0");
          } else {
            console.warn(`updateSvg: SVG element with id 'userImage' not found or is not an <image> tag.`);
          }
        } else {
          console.warn(`updateSvg: Image data for filename '${imageFilenameFromExcel}' not found in uploaded batch.`);
        }
      } else {
        console.warn("updateSvg: Excel row's first column (for image filename) is empty or not found.");
      }
    }
    return new XMLSerializer().serializeToString(svg);
  };

  const handleSaveToHistory = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user._id) {
      alert("User not logged in");
      return;
    }
    const zipBlob = await generateZip();
    const formData = new FormData();
    formData.append("file", zipBlob, "design.zip");
    formData.append("userId", user._id);
    try {
      const response = await fetch("http://localhost:3000/save-history", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("Design saved to history!");
      } else {
        alert("Failed to save history");
      }
    } catch (error) {
      console.error("Save to history error:", error);
    }
  };

  const generateZip = async () => {
    const zip = new JSZip();
    for (let i = 0; i < cardsData.length; i++) {
      const row = cardsData[i];
      const frontSvgStr = updateSvg(svgFront, row, uploadedImagesMap);
      const backSvgStr = updateSvg(svgBack, row, uploadedImagesMap);
      if (!frontSvgStr || !backSvgStr) continue;
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.width = "170px";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      const frontDiv = document.createElement("div");
      frontDiv.style.width = "170px";
      frontDiv.style.height = "270px";
      frontDiv.innerHTML = frontSvgStr;
      const backDiv = document.createElement("div");
      backDiv.style.width = "170px";
      backDiv.style.height = "270px";
      backDiv.innerHTML = backSvgStr;
      container.appendChild(frontDiv);
      container.appendChild(backDiv);
      document.body.appendChild(container);
      try {
        const frontCanvas = await html2canvas(frontDiv, { useCORS: true, scale: 2 });
        const backCanvas = await html2canvas(backDiv, { useCORS: true, scale: 2 });
        const frontBlob = await new Promise((res) => frontCanvas.toBlob(res, "image/png"));
        const backBlob = await new Promise((res) => backCanvas.toBlob(res, "image/png"));
        const cardName = row[Object.keys(row)[0]] || `card_${i + 1}`;
        if (frontBlob) zip.file(`${cardName}_front.png`, frontBlob);
        if (backBlob) zip.file(`${cardName}_back.png`, backBlob);
      } catch (error) {
        console.error(`Error generating for card ${i + 1}:`, error);
      } finally {
        document.body.removeChild(container);
      }
    }
    return zip.generateAsync({ type: "blob" });
  };

  const exportAllAsZip = async () => {
    if (cardsData.length === 0) {
      alert("No card data to export. Please generate cards first.");
      return;
    }
    if (!svgFront || !svgBack) {
      alert("SVG templates are not loaded. Please ensure templates are set in the Design tab.");
      return;
    }

    const zip = new JSZip();
    alert("Generating ZIP file... This might take a moment depending on the number of cards and image sizes.");

    for (let i = 0; i < cardsData.length; i++) {
      const row = cardsData[i];
      const frontSvgStr = updateSvg(svgFront, row, uploadedImagesMap);
      const backSvgStr = updateSvg(svgBack, row, uploadedImagesMap);
      if (!frontSvgStr || !backSvgStr) {
        console.error(`Skipping PNG generation for card ${i + 1} due to invalid SVG templates.`);
        continue;
      }
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "-9999px";
      container.style.top = "0";
      container.style.width = "170px";
      container.style.height = "auto";
      container.style.background = "white";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "0.5rem";
      document.body.appendChild(container);

      const frontDiv = document.createElement("div");
      frontDiv.style.width = "170px";
      frontDiv.style.height = "270px";
      frontDiv.innerHTML = frontSvgStr;

      const backDiv = document.createElement("div");
      backDiv.style.width = "170px";
      backDiv.style.height = "270px";
      backDiv.innerHTML = backSvgStr;

      container.appendChild(frontDiv);
      container.appendChild(backDiv);

      try {
        const frontCanvas = await html2canvas(frontDiv, { backgroundColor: null, useCORS: true, scale: 2 });
        const backCanvas = await html2canvas(backDiv, { backgroundColor: null, useCORS: true, scale: 2 });
        const frontBlob = await new Promise((res) => frontCanvas.toBlob(res, "image/png"));
        const backBlob = await new Promise((res) => backCanvas.toBlob(res, "image/png"));

        const cardName = row[Object.keys(row)[0]] || `card_${i + 1}`;
        if (frontBlob) zip.file(`${cardName}_front.png`, frontBlob);
        if (backBlob) zip.file(`${cardName}_back.png`, backBlob);
      } catch (error) {
        console.error(`Error generating PNG for card ${i + 1}:`, error);
      } finally {
        if (document.body.contains(container)) {
          document.body.removeChild(container);
        }
      }
    }

    zip
      .generateAsync({ type: "blob" })
      .then((content) => {
        saveAs(content, "id_cards.zip");
        alert("ID cards ZIP generated successfully!");
        console.log("ID cards ZIP generated successfully!");
      })
      .catch((err) => {
        console.error("Error generating ZIP file:", err);
        alert("Failed to generate ZIP file. Check console for details.");
      });
  };

  const downloadSampleExcel = () => {
    const headers = [
      "image_filename",
      "name",
      "role",
      "idnumber",
      "companyname",
      "bloodgroup",
      "emailid",
      "doorNo",
      "street",
      "location",
      "district",
    ];

    const sampleData = [
      {
        image_filename: "sample1.png",
        name: "John Doe",
        role: "Software Engineer",
        idnumber: "EMP001",
        companyname: "Tech Solutions Inc.",
        bloodgroup: "A+",
        emailid: "john.doe@example.com",
        doorNo: "123",
        street: "Main St",
        location: "Anytown",
        district: "District A",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sample");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "sample_idcard_input.xlsx");
    console.log("Sample Excel downloaded!");
  };

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  };

  // --------- Handle "OrderNow" button click ---------
 const handleOrderNow = () => {
    // Pass the editedCount via state
    navigate('/payment', { state: { editedCount } });
  };

  return (
    <div style={containerStyle}>
      {/* Place OrderNow button at the top */}
      

      {/* Main content */}
      <div>
        <div style={{ fontFamily: "Arial" }}>
  
          {/* Your existing UI elements */}
          <div
            className="m-5 p-5 shadow-lg text-center"
            style={{ borderRadius: "40px", height: "350px", width: "500px" }}
          >
            <button className="btn btn-primary" onClick={downloadSampleExcel}>
              Download Excel Template
            </button>
            {/* Excel Upload */}
            <div style={{ marginTop: 20 }}>
              <label style={{ marginLeft: 10 }}>Upload Student Data (.excel)</label>
              <input
                type="file"
                accept=".xlsx"
                onChange={handleExcelFileUpload}
              />
            </div>
            {/* ZIP Upload */}
            <div style={{ marginTop: 20 }}>
              <label style={{ marginLeft: 10 }}>Upload ZIP of Photos</label>
              <br />
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageBatchUpload}
              />
              {uploadedImagesMap.size > 0 && (
                <p
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.9em",
                    color: "green",
                  }}
                >
                  Loaded {uploadedImagesMap.size} image(s).
                </p>
              )}
            </div>
            {/* Generate ID Cards Button */}
            <button
              onClick={handleGenerateCards}
              className="btn btn-primary m-3"
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#0056b3")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#007bff")
              }
            >
              Generate ID Cards
            </button>
          </div>

          {/* Display generated cards if any */}
          {showGeneratedCards && cardsData.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2rem",
                marginTop: "1rem",
                borderTop: "1px dashed #ccc",
                paddingTop: "1rem",
                justifyContent: "center",
              }}
            >
              {cardsData.map((row, idx) => {
                const frontSvg = updateSvg(svgFront, row, uploadedImagesMap);
                const backSvg = updateSvg(svgBack, row, uploadedImagesMap);
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      padding: "10px",
                      border: "1px solid #eee",
                      borderRadius: "8px",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                      backgroundColor: "#fff",
                      margin: "10px",
                    }}
                  >
                    <h3>Person {idx + 1}</h3>
                    <div className="d-flex gap-3">
                      <div
                        style={{
                          width: 170,
                          height: 270,
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                        dangerouslySetInnerHTML={{ __html: frontSvg }}
                      />
                      <div
                        style={{
                          width: 170,
                          height: 270,
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          overflow: "hidden",
                        }}
                        dangerouslySetInnerHTML={{ __html: backSvg }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Buttons to download ZIP and save to history */}
          {showGeneratedCards && cardsData.length > 0 && (
            <div style={{ display: "flex", gap: "1rem" }}>
              <button className="btn btn-primary" onClick={handleSaveToHistory}>Save</button>
              <button onClick={() => { handleOrderNow(); handleSaveToHistory(); }} className="btn btn-success">
  Order Now 
</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}