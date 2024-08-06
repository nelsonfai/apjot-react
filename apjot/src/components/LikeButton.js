'use client';

import React, { useState } from 'react';
import { executeFunction } from "@/lib/context/article";

const LikeButton = ({ initialCount, articleId }) => {
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
      <img src="/clapping.png" alt="Applauds" />
      <span style={{ fontSize: "16px", color: "black" }}>
        {" "}
        {likeCount}
      </span>
    </button>
  );
};

export default LikeButton;
