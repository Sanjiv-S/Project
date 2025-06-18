import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [score, setScore] = useState(null);
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobRole, setJobRole] = useState("java_developer");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setScore(null);
    setMatchedKeywords([]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a resume file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jd", jobRole);

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:8080/api/upload-pdf", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setScore(response.data.score);
      setMatchedKeywords(response.data.matchedKeywords);
    } catch (error) {
      alert("Failed to screen resume.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>Resume Screening Tool</h2>

      <label>
        Select Job Role:
        <select value={jobRole} onChange={(e) => setJobRole(e.target.value)} style={{ marginLeft: 10 }}>
          <option value="java_developer">Java Developer</option>
          <option value="data_scientist">Data Scientist</option>
        </select>
      </label>

      <br /><br />

      <input type="file" accept=".pdf" onChange={handleFileChange} />
      <button onClick={handleSubmit} style={{ marginLeft: 10 }}>Submit</button>

      {loading && <p>Processing...</p>}

      {score !== null && (
        <div style={{ marginTop: 20 }}>
          <p><strong>Match Score:</strong> {score}%</p>
          <div style={{ background: '#ddd', borderRadius: '4px', height: '20px', width: '100%' }}>
            <div style={{
              height: '100%',
              width: `${score}%`,
              background: score > 70 ? 'green' : score > 40 ? 'orange' : 'red',
              borderRadius: '4px',
              transition: 'width 0.3s ease-in-out'
            }}></div>
          </div>
          <p><strong>Matched Keywords:</strong></p>
          <ul>
            {matchedKeywords.map((word, index) => (
              <li key={index}>{word}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
