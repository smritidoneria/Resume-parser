import React from "react";

const videos = [
  { id: "Tt08KmFfIYQ", title: "Resume Tips 1" },
  { id: "NcD3nufvA7Y", title: "Resume Tips 2" },
  { id: "R3abknwWX7k", title: "Resume Tips 3" },
  { id: "XJ7bYdjKDcA", title: "Resume Tips 4" },
  { id: "R3abknwWX7k", title: "Resume Tips 5" },
  { id: "NRTs4HsICI8", title: "Resume Tips 6" },
];

const YoutubeLinksPage = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Resume Video Resources</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)", // 4 videos in a row
          gap: "20px",
        }}
      >
        {videos.map((video) => (
          <div key={video.id} style={{ textAlign: "center" }}>
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${video.id}`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: "10px" }}
            ></iframe>
            <p style={{ marginTop: "10px", fontWeight: 500 }}>{video.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default YoutubeLinksPage;
