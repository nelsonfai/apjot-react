'use client';

import React, { useState } from 'react';
import { executeFunction } from "@/lib/context/article";

const HighlightButton = ({ initialCount, articleId }) => {
  const [likeCount, setLikeCount] = useState(initialCount);

  const handleLike = async () => {
    setLikeCount(likeCount + 1);
    executeFunction(articleId).then((data) => {
      if (data) {
        // Optionally handle additional data from the function
      }
    });
  };

  return (
    <button className="button" onClick={handleLike}>
      <img src="/textmarker.png" alt="Applauds" />
      <span style={{ fontSize: "16px", color: "black" }}>
        {" "}
        {2}
      </span>
    </button>
  );
};

export default HighlightButton;
