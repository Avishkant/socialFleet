import React, { useState } from "react";
import "./Popup.scss";

const Popup = ({ open, handleClose, handleCaptionGenerated }) => {
  const [keywords, setKeywords] = useState("");
  const [caption, setCaption] = useState("");

  const handleGenerateCaption = () => {
    // Simulate caption generation logic
    const generatedCaption = `Generated caption for: ${keywords}`;
    setCaption(generatedCaption);
    handleCaptionGenerated(generatedCaption); // Call the function passed as prop
  };

  if (!open) return null;

  return (
    <div className="caption-popup">
      <div className="popup-content">
        <button className="close-btn" onClick={handleClose}>X</button>
        <h2>Generate Caption</h2>
        <input
          type="text"
          placeholder="Enter keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />
        <button className="generate-btn" onClick={handleGenerateCaption}>
          Generate
        </button>
        {caption && (
          <input
            type="text"
            className="generated-caption"
            value={caption} // Display the generated caption here
            readOnly
          />
        )}
      </div>
    </div>
  );
};

export default Popup;
