import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen === 0) return [];
  var startIndex = 0, index, indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}

const findLinks = (str, substr) => {
  if (!str.includes('https://')) {
    const insert = 'https://';
    const indices = getIndicesOf("github", str);
    let extra = 0;
    for (let i = 0; i < indices.length; i++) {
      str = [str.slice(0, indices[i] + extra), insert, str.slice(indices[i] + extra)].join('');
      extra += insert.length;
    }
    const pos2 = str.indexOf("linkedin");
    str = [str.slice(0, pos2), insert, str.slice(pos2)].join('');
  }
  const parts = str.split(/(?=https)/);
  return parts.find(part => part.includes(substr)) || '';
};

const ResumeCard = ({ resume }) => {
  const favoriteButtonOutline =
    resume.isFavorite
      ? 'https://img.icons8.com/material-rounded/96/0038ff/christmas-star.png'
      : 'https://img.icons8.com/metro/96/0038ff/star.png';

  const [show, setShow] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleFavoriteClick = () => setLoading(true);

  function networkSimulation() {
    return new Promise(resolve => setTimeout(resolve, 2000));
  }

  async function handleFavoriteRequest() {
    return await networkSimulation();
  }

  useEffect(() => {
    if (isLoading) {
      handleFavoriteRequest().then(() => {
        setLoading(false);
        setShow(false);
      });
    }
  }, [isLoading]);

  function handleViewResume() {}

  // Helper to render education/experience arrays
  const renderArray = (arr, fields) =>
    arr.map((item, idx) => (
      <div key={idx}>
        {fields.map(f => item[f] ? <p key={f}><b>{f.replace('_',' ')}:</b> {Array.isArray(item[f]) ? item[f].join(', ') : item[f]}</p> : null)}
      </div>
    ));

  // Helper to render skills
  const renderSkills = (skills) => {
    return Object.entries(skills).map(([category, list], idx) => {
      if (!list) return null; // skip if null or undefined
      // ensure it's an array, if not wrap it in an array
      const items = Array.isArray(list) ? list : [list];
      return (
        <p key={idx}>
          <b>{category.replace(/_/g, ' ')}:</b> {items.join(', ')}
        </p>
      );
    });
  };
  

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit favorites?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {resume.isFavorite
            ? `${resume.name} will be removed from your favorites.`
            : `${resume.name} will be added to your favorites.`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button variant="primary" disabled={isLoading} onClick={!isLoading ? handleFavoriteClick : null}>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" hidden={!isLoading}></span>
            {isLoading ? ' Saving Changes...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className='resumeCard'>
        <div className="resumeCardTitle">
          <p id="resume-name">
            {resume.name
              ? resume.name.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ')
              : "N/A"}
          </p>
          <button
            className='resumeFavorite'
            style={{ backgroundImage: `url(${favoriteButtonOutline})` }}
            onClick={handleShow}
          />
        </div>

        <div className="resumeCardHeader">
          <p className='contacts'>{resume.phone || "N/A"}</p>
          <p className='contacts'>{resume.email || "N/A"}</p>
        </div>

        <div id="resume-education">
          <p id="resume-title">Education:</p>
          <div id="resume-fields">
            {resume.education ? renderArray(resume.education, ['institution','degree','location','start_date','end_date','gpa','percentage']) : "N/A"}
          </div>
        </div>

        <div id="resume-experience">
          <p id="resume-title">Experience:</p>
          <div id="resume-fields">
            {resume.experience ? renderArray(resume.experience, ['title','company','location','start_date','end_date','description']) : "N/A"}
          </div>
        </div>

        <div id="resume-skills">
          <p id="resume-title">Skillset:</p>
          <div id="resume-fields">
            {resume.skills ? renderSkills(resume.skills) : "N/A"}
          </div>
        </div>

        <div className='footer'>
          <button className='viewResumeButton' onClick={handleViewResume}>View Resume</button>
          {resume.profiles &&
            <a href={findLinks(resume.profiles, "linkedin")} target="_blank" rel="noopener noreferrer">
              <img src="https://img.icons8.com/ios-glyphs/30/000000/linkedin-circled--v1.png" className='links' alt='' />
            </a>
          }
        </div>
      </div>
    </>
  );
};

export default ResumeCard;
