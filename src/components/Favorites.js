import React, { useEffect, useState } from 'react';
import ResumeCard from './resumeCard';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('favoriteResumes')) || [];
    setFavorites(saved);
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
      <h1 style={{ marginBottom: "30px", textAlign: "center", fontWeight: 600 }}>
        My Favorite Resumes
      </h1>

      {favorites.length === 0 ? (
        <p style={{ textAlign: "center", color: "#555" }}>No favorite resumes yet.</p>
      ) : (
        <div
          className="resume-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // fixed 3 columns
            gap: "20px",
          }}
        >
          {favorites.map((resume, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "center" }}>
              <ResumeCard resume={resume} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
