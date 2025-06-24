import React, { useEffect, useState } from "react";
import JSZip from "jszip";

const DesignHistory = ({ userId }) => {
  const [files, setFiles] = useState([]);
  const [activeFileId, setActiveFileId] = useState(null);
  const [zipImages, setZipImages] = useState([]);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [imagesError, setImagesError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:3000/get-history/${userId}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setFiles(data);
        } else {
          setFiles([]);
        }
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    if (userId) fetchHistory();
  }, [userId]);

  const handleViewImages = (fileId) => {
    setActiveFileId(fileId);
  };

  const handleCloseViewer = () => {
    setActiveFileId(null);
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this history item?")) return;

    try {
      const res = await fetch(`http://localhost:3000/delete-history/${fileId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((file) => file._id !== fileId));
        alert("History deleted successfully!");
      } else {
        alert("Failed to delete history.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting file. Try again.");
    }
  };

  useEffect(() => {
    if (activeFileId) {
      const fetchImages = async () => {
        setImagesLoading(true);
        setImagesError(null);
        try {
          const response = await fetch(
            `http://localhost:3000/design-history/download/${activeFileId}`
          );
          if (!response.ok) throw new Error("Failed to fetch ZIP");
          const blob = await response.blob();
          const arrayBuffer = await blob.arrayBuffer();
          const zip = await JSZip.loadAsync(arrayBuffer);
          const imageFiles = Object.keys(zip.files).filter((filename) =>
            /\.(png|jpe?g|gif|bmp|webp)$/i.test(filename)
          );
          const images = await Promise.all(
            imageFiles.map(async (filename) => {
              const imageBlob = await zip.file(filename).async("blob");
              return {
                src: URL.createObjectURL(imageBlob),
                filename,
              };
            })
          );
          setZipImages(images);
        } catch (err) {
          console.error("Error loading images:", err);
          setImagesError("Error loading images");
        } finally {
          setImagesLoading(false);
        }
      };
      fetchImages();
    }
  }, [activeFileId]);

  return (
    <div style={{ padding: "2rem" }}>

      {files.length === 0 ? (
        <p>No designs found yet. Upload and save one!</p>
      ) : (
        files.map((file) => (
          <div
            key={file._id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "1rem",
            }}
          >
            {/* First Image Preview */}
            <div style={{ width: "100px", height: "100px", marginRight: "1rem" }}>
              <FirstImagePreview fileId={file._id} />
            </div>

            {/* File details and buttons */}
            <div>
              <p style={{ margin: 0 }}>
                <strong>{file.fileName}</strong>
              </p>
              <p style={{ margin: 0, fontSize: "0.9rem" }}>
                {new Date(file.uploadedAt).toLocaleString()}
              </p>

              <button
                className="btn btn-outline-primary"
                onClick={() => handleViewImages(file._id)}
                style={{ marginRight: "0.5rem" }}
              >
                👁️ View Images
              </button>

              {/* <button
                className="btn btn-outline-danger"
                onClick={() => handleDelete(file._id)}
              >
                🗑 Delete
              </button> */}
            </div>
          </div>
        ))
      )}

      {/* Image viewer section */}
      {activeFileId && (
        <div style={{ marginTop: "2rem" }}>
          <h3>Images from ZIP</h3>
          <button
            className="btn btn-outline-primary"
            onClick={handleCloseViewer}
            style={{ marginBottom: "1rem" }}
          >
            Close
          </button>
          {imagesLoading ? (
            <p>Loading images...</p>
          ) : imagesError ? (
            <p>{imagesError}</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {zipImages.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.filename}
                  style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// First image preview component
const FirstImagePreview = ({ fileId }) => {
  const [imgUrl, setImgUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAndExtractImage = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3000/design-history/download/${fileId}`
        );
        if (!response.ok) throw new Error("Failed to fetch ZIP");
        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const zip = await JSZip.loadAsync(arrayBuffer);
        const imageFiles = Object.keys(zip.files).filter((filename) =>
          /\.(png|jpe?g|gif|bmp|webp)$/i.test(filename)
        );

        if (imageFiles.length === 0) {
          setError("No images found");
          setLoading(false);
          return;
        }

        const firstImageBlob = await zip.file(imageFiles[0]).async("blob");
        const url = URL.createObjectURL(firstImageBlob);
        setImgUrl(url);
      } catch (err) {
        console.error("Error extracting first image:", err);
        setError("Error loading image");
      } finally {
        setLoading(false);
      }
    };

    fetchAndExtractImage();
  }, [fileId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  return (
    <img
      src={imgUrl}
      alt="First preview"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  );
};

export default DesignHistory;
