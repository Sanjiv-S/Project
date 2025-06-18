import React from 'react';
import { FaFileUpload, FaChartBar } from 'react-icons/fa';

function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg px-6 py-8 border-r">
      <h2 className="text-xl font-semibold mb-6">Menu</h2>
      <ul className="space-y-4">
        <li className="flex items-center space-x-3 text-blue-700 font-medium">
          <FaFileUpload /> <span>Upload</span>
        </li>
        <li className="flex items-center space-x-3 text-blue-700 font-medium">
          <FaChartBar /> <span>Results</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;