'use client';

import React, { useState } from 'react';
import { executeFunction } from "@/lib/context/article";

const CommentCounter = ({ initialCount, articleId }) => {
  const [ count, setCount] = useState(initialCount);


  return (
    <button className="button" >
      <img src="/bubble.png" alt="Comment" />
      <span style={{ fontSize: "16px", color: "black" }}>
        {" "}
        {count}
      </span>
    </button>
  );
};

export default CommentCounter;
