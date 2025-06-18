import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Make sure to import your updated CSS

function App() {
  const [jd, setJd] = useState("java_developer");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewURL, setPreviewURL] = useState(null);

  const handleDrop = (e) => {
  e.preventDefault();
  const droppedFile = e.dataTransfer.files[0];
  if (droppedFile?.type === "application/pdf") {
    setFile(droppedFile);
    setPreviewURL(URL.createObjectURL(droppedFile));
    setResult(null);
  }
};

  const handleDragOver = (e) => {
  e.preventDefault();
};


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
  };

  const handleSubmit = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jd", jd);

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/upload-pdf", formData);
      setResult(res.data);
    } catch (err) {
      alert("Failed to screen resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      {/* Navbar */}
      <div className="navbar">
        <h1>Smart Resume Screening</h1>
      </div>

      <div className="main">
        {/* Sidebar */}
        <div className="left-panel">
          <h3>Upload & Select JD</h3>
          <select value={jd} onChange={(e) => setJd(e.target.value)} className="dropdown">
            <option value="java_developer">Java Developer</option>
            <option value="data_scientist">Data Scientist</option>
          </select>
          <div
  className="drop-zone"
  onDrop={handleDrop}
  onDragOver={handleDragOver}
>
  <p>Drag & drop your PDF here, or click to select</p>
  <input
    type="file"
    accept=".pdf"
    onChange={(e) => {
      handleFileChange(e);
      setPreviewURL(URL.createObjectURL(e.target.files[0]));
    }}
    style={{ display: 'none' }}
    id="hiddenFileInput"
  />
  <label htmlFor="hiddenFileInput" className="browse-button">Browse</label>
</div>

{previewURL && (
  <embed
    src={previewURL}
    type="application/pdf"
    width="100%"
    height="300px"
    style={{ borderRadius: "6px", marginTop: "10px" }}
  />
)}

          <button onClick={handleSubmit} className="btn-submit">Submit</button>
          {loading && <p>Analyzing...</p>}
        </div>

        {/* Results Panel */}
        <div className="right-panel">
          {result && (
            <>
              {/* Match Score */}
              <div className="section-box">
                <h3>Match Score</h3>
                <div className="score-bar-bg">
                  <div
                    className="score-bar-fill"
                    style={{
                      width: `${result.score}%`,
                      backgroundColor: result.score >= 75 ? '#28a745' : result.score >= 50 ? '#ffc107' : '#dc3545'
                    }}
                  >
                    {result.score}%
                  </div>
                </div>
              </div>

              {/* Matched Keywords */}
              <div className="section-box">
                <h3>Matched Keywords</h3>
                <ul>
                  {result.matchedKeywords?.map((word, i) => (
                    <li key={i}>{word}</li>
                  ))}
                </ul>
              </div>

              {/* Extracted Information */}
              <div className="section-box">
                <h3>Extracted Info</h3>
                <ul>
                  {result.extractedInfo && Object.entries(result.extractedInfo).map(([key, val], idx) => (
                    <li key={idx}><strong>{key}:</strong> {val}</li>
                  ))}
                </ul>
              </div>

              {/* Section Content */}
              {result.sectionsContent && (
                <div className="section-box">
                  <h3>Resume Sections</h3>
                  {Object.entries(result.sectionsContent).map(([section, content], idx) => (
                    <div key={idx}>
                      <h4>{section.charAt(0).toUpperCase() + section.slice(1)}</h4>
                      <pre>{content}</pre>
                    </div>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {result.suggestions && (
                <div className="section-box">
                  <h3>Suggestions</h3>
                  <p>{result.suggestions}</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
