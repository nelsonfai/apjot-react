'use client'
import React from "react";
import { useHighlights } from '@/lib/context/highlight';

function FormattedText({ body }) {
  const { highlightGlobal } = useHighlights();
  console.log('Log Higlishts ',highlightGlobal)
  const formatText = () => {
    let formattedText = body;
    highlightGlobal.forEach((highlight) => {
      const regex = new RegExp(highlight.text, "gi");
      formattedText = formattedText.replace(
        regex,
        `<span class="highlighted yellow">${highlight.text}</span>`,
      );
    });
    return { __html: formattedText }; // Use __html to render HTML content dynamically
  };

  return <div className="body" dangerouslySetInnerHTML={formatText()} />;
}

export default FormattedText;
