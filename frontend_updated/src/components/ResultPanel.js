import React from 'react';

function ResultPanel({ result }) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Match Score</h3>
        <div className="relative w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center text-xl font-bold">
          {result.score}%
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Matched Keywords</h3>
        <ul className="list-disc list-inside">
          {result.matchedKeywords.map((word, i) => <li key={i}>{word}</li>)}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
        <h3 className="text-xl font-semibold mb-2">Extracted Information</h3>
        <ul className="list-disc list-inside">
          {Object.entries(result.extractedInfo).map(([key, value], index) => (
            <li key={index}><strong>{key}:</strong> {value}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow md:col-span-2">
        <h3 className="text-xl font-semibold mb-2">Suggestions</h3>
        <p>{result.suggestions}</p>
      </div>
    </div>
  );
}

export default ResultPanel;
