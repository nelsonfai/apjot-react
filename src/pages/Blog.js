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
import Pagination from "../components/Pagination";
function Blog() {
  const [data, setData] = useState([]);
  const [lastId,setLastId] = useState(null)

  useEffect(() => {
    getAll(); // Call getAll function when component mounts
  }, []);

  // Function to fetch all documents
  const getAll = (x=null) => {
    getAllDocuments(x).then((data) => {
      setData(data.data)
      setLastId(data.lastId)
    }
    );
  };

  // Function to filter data by a given filter
  const filter = (filter) => {
    getByFilter(filter).then((data) => setData(data)); // Update data state with filtered data
  };

  // Function to search data by a given search term
  const search = (searchTerm) => {
    getSearch(searchTerm).then((data) => setData(data)); // Update data state with search results
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <FilterSection getAll={getAll} handleFilter={filter} search={search} />
  { data.length >0 && (
    <div> 
  <ul className="article-list">
        {data.map((item, index) => (
          <li key={item.$id}>
            <Link to={`/blog/${item.slug}`}>
              <ArticleCard article={item} />
            </Link>
          </li>
        ))}
      </ul>

      </div>)
      }

      {data.length === 0 && (
        <div style={{height:'60vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
          <p style={{ fontSize: "20px",fontWeight:'bold' }}>No Article</p>
        </div>
      )}
    </div>
  );
}
export default Blog;
