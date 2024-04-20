import React from "react";
import "../styles/pagination.css"; 

function Pagination({ currentPage, totalPages, onPageChange }) {
  // Function to handle page navigation
  const handlePageChange = (newPage) => {
    onPageChange(newPage);
  };

  return (
    <div className="pagination-container">

      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}>
        Previous
      </button>

      <span className="pagination-current-page">{currentPage}</span>

      <button
        className="pagination-button"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}>
        Next
      </button>
      
    </div>
  );
}

export default Pagination;
