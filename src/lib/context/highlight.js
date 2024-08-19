'use client'
import React, { createContext, useContext, useState } from 'react';

const HighlightsContext = createContext();

export const HighlightsProvider = ({ children }) => {
  const [highlightGlobal, setHighlightGlobal] = useState([]);

  return (
    <HighlightsContext.Provider value={{ highlightGlobal, setHighlightGlobal }}>
      {children}
    </HighlightsContext.Provider>
  );
};

export const useHighlights = () => useContext(HighlightsContext);
