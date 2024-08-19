"use client"; // This directive makes the component a Client Component

import React, { useState, useEffect } from "react";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import FilterSection from "@/components/FilterSection";
import Pagination from "@/components/Pagination";
import {
  getAllDocuments,
  getByFilter,
  getSearch,
} from "@/lib/context/article";
import SubscribePopup from "./SubscribePopup";

function BlogContent({ initialData, lastId }) {
  const [data, setData] = useState(initialData || []); // Ensure data is initialized as an empty array
  const [currentLastId, setLastId] = useState(lastId || null);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      openPopup(); // Automatically open the pop-up after 10 seconds
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, []);


  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage, setArticlesPerPage] = useState(5); // Number of articles per page
  const [totalPages, setTotalPages] = useState(
    Math.ceil((initialData?.length || 0) / articlesPerPage)
  );

  useEffect(() => {
    // Recalculate total pages whenever data or articlesPerPage changes
    setTotalPages(Math.ceil(data.length / articlesPerPage));
  }, [data, articlesPerPage]);

  // Calculate the current articles to display based on pagination
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = data.slice(indexOfFirstArticle, indexOfLastArticle);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Fetch all documents
  const getAll = async (x = null) => {
    try {
      const response = await getAllDocuments(x);
      setData(response.data || []);
      setLastId(response.lastId || null);
      setCurrentPage(1); // Reset to the first page when fetching new data
    } catch (error) {
      console.error("Error fetching all documents:", error);
    }
  };

  // Filter data
  const filter = async (filter) => {
    try {
      const response = await getByFilter(filter);
      setData(response.data || []);
      setCurrentPage(1); // Reset to the first page when filtering data
    } catch (error) {
      console.error("Error filtering data:", error);
    }
  };

  // Search data
  const search = async (searchTerm) => {
    try {
      const response = await getSearch(searchTerm);
      setData(response.data || []);
      setCurrentPage(1); // Reset to the first page when searching data
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };




  return (
    <div>
      <FilterSection getAll={getAll} handleFilter={filter} search={search} />
      
      {data.length === 0 ? (
        <div
          style={{
            height: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>No Article</p>
        </div>
      ) : (
        <>
          <ul className="article-list">
            {currentArticles.map((item) => (
              <li key={item.$id}>
                    <ArticleCard article={item} />
              </li>
            ))}
          </ul>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
        <SubscribePopup isOpen={isPopupOpen} onClose={closePopup} />
      

    </div>
  );
            }
export default BlogContent;
