import React, { useState, useEffect } from "react";
import {
  getAllDocuments,
  getByFilter,
  getSearch,
} from "../lib/context/article";
import ArticleCard from "../components/ArticleCard";
import FilterSection from "../components/FilterSection";
import "../styles/Blog.css";
function Blog() {
  const [data, setData] = useState([]);
  console.log("data", data);

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
            <ArticleCard article={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Blog;
