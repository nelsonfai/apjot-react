import React, { useState, useEffect } from "react";
import {
  getAllDocuments,
  getByFilter,
  getSearch,
} from "../lib/context/article";
import ArticleCard from "../components/ArticleCard";
import FilterSection from "../components/FilterSection";
import "../styles/Blog.css";
import { Link } from "react-router-dom"; // Import Link from React Router

function Blog() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getAll();
  }, []);

  const getAll = () => {
    getAllDocuments().then((data) => setData(data));
  };
  const filter = (filter) => {
    getByFilter(filter).then((data) => setData(data));
  };
  const search = (searchTerm) => {
    getSearch(searchTerm).then((data) => setData(data));
  };

  if (!data) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <FilterSection getAll={getAll} handleFilter={filter} search={search} />
      <ul className="article-list">
        {data.map((item, index) => (
          <li key={item.$id}>
            <Link to={`/blog/${item.slug}`}>
              <ArticleCard article={item} />
            </Link>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default Blog;
