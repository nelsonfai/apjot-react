import React from "react";

function FormattedText({ body, highlights }) {
  const formatText = () => {
    let formattedText = body;
    highlights.forEach((highlight) => {
      const regex = new RegExp(highlight.text, "gi");
      formattedText = formattedText.replace(
        regex,
        `<span className="highlighted yellow">${highlight.text}</span>`,
      );
    });
    return { __html: formattedText }; // Use __html to render HTML content dynamically
  };

  return <div className="body" dangerouslySetInnerHTML={formatText()} />;
}

export default FormattedText;
