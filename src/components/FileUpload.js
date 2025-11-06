import React, { useState, useEffect } from "react";
import UploadPic from "./sidebar-icons/UploadPic.png";
import UploadFile from "./sidebar-icons/uploadFile.svg";
import { Storage } from "aws-amplify";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [filename, setFilename] = useState("Drop your file here.");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fileInput = document.querySelector("input[type=file]");
    const dropzone = document.querySelector("label");

    fileInput.addEventListener("change", function () {
      fileInput.files.length > 1
        ? setFilename(fileInput.files.length + " files to upload")
        : setFilename(fileInput.value.split("\\").pop());
    });

    fileInput.addEventListener("dragenter", () => dropzone.classList.add("dragover"));
    fileInput.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
  }, []);

  const onChange = (e) => setFiles(e.target.files);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return toast.error("Please select a file first!", { position: "top-center" });
    setIsLoading(true);

    await Promise.all(
      [...files].map((file) => {
        if (file.type === "application/pdf") {
          Storage.put(file.name, file)
            .then(() => {
              toast.success(`Successfully uploaded: ${file.name}`, { position: "top-center" });
            })
            .catch((e) => {
              toast.error(`Upload failed for ${file.name}: ${e}`, { position: "top-center" });
            });
        } else {
          toast.error(`File type not supported for: ${file.name}. Please upload PDF.`, { position: "top-center" });
        }
      })
    );
    setIsLoading(false);
  };

  const handleOptimizeResume = () => {
    window.open("https://www.overleaf.com/", "_blank");
  };
  
  const handleYoutubeLinks = () => {
    window.open("/youtube-links", "_blank"); // Opens a new page/route
  };
  

  return (
    <div className="dashboard-container" style={{ display: "flex", gap: "30px", padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Left Side - Info & Image */}
      <div className="left-side" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
        <h1 style={{ fontWeight: 600 }}>Welcome, User!</h1>
        <p style={{ fontSize: "16px", color: "#555", margin: "10px 0" }}>
          Enhance your resume effortlessly and stand out to top employers.
        </p>
        <p style={{ fontSize: "14px", color: "#888", marginBottom: "20px" }}>
          Over 99% of users have successfully improved their resumes with our platform.
        </p>
        <img src={UploadPic} alt="upload-logo" style={{ width: "100%", maxWidth: "250px", borderRadius: "10px", boxShadow: "0 4px 15px rgba(0,0,0,0.1)" }} />
      </div>

      {/* Right Side - Upload Card */}
      <div className="right-side" style={{ flex: 1 }}>
        <div style={{ backgroundColor: "#fff", padding: "25px", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
          <h2 style={{ marginBottom: "20px", fontWeight: 500 }}>Upload Your Resume</h2>
          <form onSubmit={onSubmit}>
            <label
              htmlFor="customFile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                padding: "15px",
                border: "2px dashed #0d6efd",
                borderRadius: "10px",
                cursor: "pointer",
                marginBottom: "20px",
                transition: "all 0.2s ease",
              }}
              className="custom-file-label"
            >
              {isLoading ? (
                <div className="spinner-border text-secondary" role="status" />
              ) : (
                <img src={UploadFile} alt="" style={{ width: "35px" }} />
              )}
              <span style={{ fontSize: "14px", color: "#333" }}>{filename}</span>
              <input
                type="file"
                id="customFile"
                onChange={onChange}
                multiple
                disabled={isLoading}
                style={{ display: "none" }}
              />
            </label>

            <input
              type="submit"
              value="Submit Resume"
              className="btn btn-primary btn-block"
              style={{ width: "100%", marginBottom: "15px", backgroundColor: "#0d6efd", borderColor: "#0d6efd" }}
              disabled={isLoading}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" className="btn" style={{ flex: 1, backgroundColor: "#198754", color: "#fff", border: "none" }} onClick={handleOptimizeResume}>
                Optimize Resume
              </button>
              <button type="button" className="btn" style={{ flex: 1, backgroundColor: "#0dcaf0", color: "#fff", border: "none" }} onClick={handleYoutubeLinks}>
                YouTube Links
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
