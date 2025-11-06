import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./resumeCard.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";







function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen === 0) return [];
  var startIndex = 0, index, indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = str.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

const findLinks = (str, substr) => {
  if (!str.includes("https://")) {
    const insert = "https://";
    const indices = getIndicesOf("github", str);
    let extra = 0;
    for (let i = 0; i < indices.length; i++) {
      str = [str.slice(0, indices[i] + extra), insert, str.slice(indices[i] + extra)].join("");
      extra += insert.length;
    }
    const pos2 = str.indexOf("linkedin");
    str = [str.slice(0, pos2), insert, str.slice(pos2)].join("");
  }
  const parts = str.split(/(?=https)/);
  return parts.find((part) => part.includes(substr)) || "";
};

const ResumeCard = ({ resume }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const FAVORITES_KEY = "favoriteResumes";


useEffect(() => {
  const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  setFavorites(saved);
}, []);

const isFavorite = favorites.some((r) => r.email === resume.email);

const favoriteButtonOutline = isFavorite
  ? "https://img.icons8.com/material-rounded/96/0038ff/christmas-star.png"
  : "https://img.icons8.com/metro/96/0038ff/star.png";



  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleFavoriteClick = () => setLoading(true);

  function networkSimulation() {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  }

  async function handleFavoriteRequest() {
    setLoading(true);
  await networkSimulation();

  const saved = JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];

  let updated;
  if (resume.isFavorite) {
    // Remove from favorites
    updated = saved.filter((r) => r.email !== resume.email);
  } else {
    // Add to favorites
    updated = [...saved, resume];
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  setFavorites(updated);

  setLoading(false);
  setShow(false);
  }

  useEffect(() => {
    if (isLoading) {
      handleFavoriteRequest().then(() => {
        setLoading(false);
        setShow(false);
      });
    }
  }, [isLoading]);

  const extractField = (arr, field) => {
    if (!Array.isArray(arr)) return arr || "N/A";
    const values = arr
      .map((item) => (typeof item === "object" ? item[field] : item))
      .filter(Boolean);
    return values.length > 0 ? values.join(", ") : "N/A";
  };

  const renderSkills = (skills) => {
    if (!skills) return "N/A";
    if (Array.isArray(skills)) return <span>{skills.join(", ")}</span>;
    if (typeof skills === "string") return <span>{skills}</span>;
    return Object.entries(skills).map(([category, list], idx) => {
      const items = Array.isArray(list) ? list : [list];
      return (
        <p key={idx}>
          <b>{category.replace(/_/g, " ")}:</b> {items.join(", ")}
        </p>
      );
    });
  };

  function handleViewResume() {
    setShowViewModal(true);
  }
  // Capture and download resume section as PDF
const handleDownloadPDF = async () => {
  const input = document.querySelector(".resume-full-view"); // the modal body
  if (!input) return;

  const canvas = await html2canvas(input, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  pdf.save(`${resume.name || "resume"}.pdf`);
};

// Generate a shareable link (dummy version for now)
const handleShareLink = async () => {
  const shareUrl = `${window.location.origin}/resume/${encodeURIComponent(resume.email)}`;
  
  if (navigator.share) {
    await navigator.share({
      title: `${resume.name}'s Resume`,
      text: "Check out this resume:",
      url: shareUrl,
    });
  } else {
    await navigator.clipboard.writeText(shareUrl);
    alert("Link copied to clipboard!");
  }
};

  

  return (
    <>
      {/* Favorite modal */}
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit favorites?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resume.isFavorite
            ? `${resume.name} will be removed from your favorites.`
            : `${resume.name} will be added to your favorites.`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={isLoading}
            onClick={!isLoading ? handleFavoriteClick : null}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>

     {/* ✅ View Resume Modal */}
<Modal
  show={showViewModal}
  onHide={() => setShowViewModal(false)}
  size="lg"
  centered
  className="view-resume-modal"
>
  <Modal.Header closeButton>
    <Modal.Title>{resume.name || "Resume Preview"}</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <div className="resume-full-view">
      {/* Basic Info */}
      <section className="resume-section">
        <h4>Personal Details</h4>
        <p><b>Email:</b> {resume.email || "N/A"}</p>
        <p><b>Phone:</b> {resume.phone || "N/A"}</p>
        {resume.location && <p><b>Location:</b> {resume.location}</p>}
      </section>

      {/* Education */}
      {resume.education && (
        <section className="resume-section">
          <h4>Education</h4>
          {Array.isArray(resume.education)
            ? resume.education.map((edu, idx) => (
                <div key={idx}>
                  <p><b>{edu.institution}</b></p>
                  {edu.degree && <p>{edu.degree}</p>}
                  {edu.year && <p>{edu.year}</p>}
                </div>
              ))
            : <p>{extractField(resume.education, "institution")}</p>}
        </section>
      )}

      {/* Experience */}
      {resume.experience && (
        <section className="resume-section">
          <h4>Experience</h4>
          {Array.isArray(resume.experience)
            ? resume.experience.map((exp, idx) => (
                <div key={idx}>
                  <p><b>{exp.title}</b> – {exp.company || ""}</p>
                  {exp.duration && <p>{exp.duration}</p>}
                  {exp.description && <p>{exp.description}</p>}
                </div>
              ))
            : <p>{extractField(resume.experience, "title")}</p>}
        </section>
      )}

      {/* Projects */}
      {resume.projects && (
        <section className="resume-section">
          <h4>Projects</h4>
          {Array.isArray(resume.projects)
            ? resume.projects.map((proj, idx) => (
                <div key={idx}>
                  <p><b>{proj.name}</b></p>
                  {proj.description && <p>{proj.description}</p>}
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noopener noreferrer">
                      View Project
                    </a>
                  )}
                </div>
              ))
            : <p>{resume.projects}</p>}
        </section>
      )}

      {/* Skills */}
      {resume.skills && (
        <section className="resume-section">
          <h4>Skills</h4>
          <p>{Array.isArray(resume.skills) ? resume.skills.join(", ") : renderSkills(resume.skills)}</p>
        </section>
      )}

      {/* Achievements */}
      {resume.achievements && (
        <section className="resume-section">
          <h4>Achievements</h4>
          <ul>
            {resume.achievements.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}

      {/* Certifications */}
      {resume.certifications && (
        <section className="resume-section">
          <h4>Certifications</h4>
          <ul>
            {resume.certifications.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>
      )}

      {/* Links */}
      {resume.profiles && (
        <section className="resume-section">
          <h4>Profiles</h4>
          <a
            href={findLinks(resume.profiles, "linkedin")}
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </section>
      )}
    </div>
  </Modal.Body>

  <Modal.Footer className="view-resume-footer">
  <Button variant="outline-primary" onClick={handleDownloadPDF}>
    Download PDF
  </Button>
  <Button variant="outline-success" onClick={handleShareLink}>
    Share Link
  </Button>
  <Button variant="secondary" onClick={() => setShowViewModal(false)}>
    Close
  </Button>
</Modal.Footer>

</Modal>


      {/* Card layout */}
      <div className="resume-card">
        <div className="resume-card-header">
          <h2 className="resume-name">
            {resume.name
              ? resume.name
                  .toLowerCase()
                  .split(" ")
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(" ")
              : "N/A"}
          </h2>
          <button
            className="favorite-btn"
            style={{ backgroundImage: `url(${favoriteButtonOutline})` }}
            onClick={handleShow}
          />
        </div>

        <div className="resume-contact">
          <p>{resume.phone || "N/A"}</p>
          <p>{resume.email || "N/A"}</p>
        </div>

        <div className="resume-section">
          <p className="section-title">Education</p>
          <span>{resume.education ? extractField(resume.education, "institution") : "N/A"}</span>
        </div>

        <div className="resume-section">
          <p className="section-title">Experience</p>
          <span>{resume.experience ? extractField(resume.experience, "title") : "N/A"}</span>
        </div>

        <div className="resume-section">
          <p className="section-title">Skillset</p>
          <div>{resume.skills ? renderSkills(resume.skills) : "N/A"}</div>
        </div>

        <div className="resume-footer">
          <button className="view-btn" onClick={handleViewResume}>
            View Resume
          </button>
          {resume.profiles && (
            <a
              href={findLinks(resume.profiles, "linkedin")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.icons8.com/ios-glyphs/30/000000/linkedin-circled--v1.png"
                className="linkedin-icon"
                alt="linkedin"
              />
            </a>
          )}
        </div>
      </div>
    </>
  );
};

export default ResumeCard;
