import React, { useEffect, useState } from "react";
import Search from "./components/Search";
import ResumeContainer from "./components/ResumeContainer";
import "./ResumeViewer.css";
import { API } from "aws-amplify";
import { listResumes } from "./api/queries";

// Replace with your Gemini API key
const GEMINI_API_KEY = "AIzaSyBJcL6jpbkN1Xgj0IKwYYuzby7mL08Xl8M";

// Function to extract structured fields from rawText using Gemini
const extractFieldsFromResume = async (resumeText) => {
  console.log("a", resumeText);
  const response = await fetch("http://localhost:4000/extract", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rawText: resumeText }),
  });
  const data = await response.json();
  console.log("b", data);
  return data;
};

export default function ResumeViewer() {
  const [resumes, setResumes] = useState([]);
  const [processedResumes, setProcessedResumes] = useState([]);
  const [search, setSearch] = useState("");
  const [searchedResumes, setSearchedResumes] = useState([]);

  // Fetch resumes from DynamoDB
  const fetchResumes = async () => {
    try {
      const { data } = await API.graphql({
        query: listResumes,
        authMode: "API_KEY",
      });
      const resumes = data.listResumes.items;
      setResumes(resumes);

      // Extract structured fields for each resume using LLM
      const processed = await Promise.all(
        resumes.map(async (resume) => {
          const fields = await extractFieldsFromResume(resume.rawText);
          return { ...resume, ...fields }; // Merge extracted fields
        })
      );

      setProcessedResumes(processed);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // Handle search
  const handleChange = (newValue) => {
    setSearch(newValue);
    if (!newValue) setSearchedResumes([]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const results = processedResumes.filter((resume) => {
      return Object.values(resume).some(
        (val) =>
          val && val.toString().toLowerCase().includes(search.toLowerCase())
      );
    });
    setSearchedResumes(results);
  };

  return (
    <>
      <Search search={search} onChange={handleChange} onSubmit={handleSubmit} />
      {searchedResumes.length > 0 ? (
        <ResumeContainer resumes={searchedResumes} />
      ) : (
        <ResumeContainer resumes={processedResumes} />
      )}
    </>
  );
}
