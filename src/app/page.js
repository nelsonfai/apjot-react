'use client'; // Add this directive

import React, { useState, useEffect } from "react";
import "./home.css";
import { getAllFeatured } from "@/lib/context/article";
import ArticleCard from "@/components/ArticleCard";
import Link from "next/link";
import CookiePolicy from "@/components/cookiePolicy";
import SubscribePopup from "@/components/SubscribePopup";

function Home() {
  const [preloader, setPreloader] = useState(true); // Changed initial state to true
  const [rotatedText, setRotatedText] = useState(""); // Removed unnecessary useState
  const [data, setData] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      openPopup(); // Automatically open the pop-up after 10 seconds
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => clearTimeout(timer); // Clean up the timer if the component unmounts
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPreloader(false);
    }, 3000);

    getAllFeatured().then((data) => setData(data)); // Moved this inside useEffect

    // Cleanup function to remove any timeouts or intervals
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Create rotated text dynamically
    const originalText = "scroll. down. scroll. down";
    const rotatedChars = originalText.split("").map((char, i) => (
      <span key={i} style={{ transform: `rotate(${i * 13.3}deg)` }}>
        {char}
      </span>
    ));
    setRotatedText(rotatedChars);
  }, []); // Added dependency array

  return (
    <div>
      <div>
        <style>
          {`
            .preloader {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: white;
              z-index: 9999;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
            }
            /* Add more styles as needed */
          `}
        </style>
        <div id="circle2"></div>

        {preloader && (
          <div className="preloader">
            <img
              src="ezgif.com-gif-to-webp.webp"
              alt="Preloader Image apjot"
              style={{ height: "150px", width: "150px" }}
            />
            <p style={{ textAlign: "center" }}>
              Self Growth through Self Exploration
            </p>
          </div>
        )}
        <div className="index_wrapper">
          <header>
            <div className="hero">
              <p
                style={{
                  fontSize: "small",
                  fontWeight: 100,
                  paddingBottom: "10px",
                  textAlign: "right",
                }}
              >
                {" "}
              </p>
              <h1 className="hero-text" style={{ fontWeight: 800 }}>
                A <br /> Public Journal <br /> of thoughts
              </h1>
              <span
                style={{
                  fontSize: "larger",
                  fontWeight: 100,
                  borderBottom: "1px solid #000",
                  paddingBottom: "10px",
                }}
              >
                Self growth through self exploration
              </span>
              <span
                style={{
                  fontSize: "small",
                  fontWeight: 200,
                  borderBottom: "1px solid lightgray",
                  paddingBottom: "10px",
                  float: "right",
                }}
                id="heroSubscribe"
              >
                {" "}
                <a href="#subscribeToNewsletter">
                  <i className="fa-solid fa-envelope"></i> Subscribe to
                  Newletter{" "}
                </a>
              </span>
            </div>
            <div style={{ margin: "auto" }}>
              <div
                className="circle"
                onClick={() => (window.location.href = "#values")}
                id="rotatetext"
              >
                <div className="text">
                  <p>{rotatedText}</p>
                </div>
                <Link
                  href="#values"
                  style={{
                    position: "absolute",
                    top: "calc(50% - 17px)",
                    right: "calc(50% - 17px)",
                  }}
                >
                  {" "}
                  <img
                    src="https://img.icons8.com/ios-filled/35/null/chevron-down.png"
                    alt="icon-arrow down"
                  />
                </Link>
              </div>
            </div>
          </header>
          {/* Featured post section */}
          <section
            style={{
              marginBlock: "2rem",
              paddingBlock: "1rem",
              backgroundColor: "whitesmoke",
            }}
          >
            <h3 className="section-title">
              <span>Featured post </span> 
              <span
                style={{
                  fontSize: "1.5rem",
                  textTransform: "initial",
                  fontWeight: 100,
                }}
              >
                <br/>
                {" "}
                <a href="/blog/">
                  See all Posts <i className="fa-solid fa-angle-right"></i>{" "}
                </a>
              </span>{" "}
            </h3>
            <br />
            <div className="grid-container">
              {/* Render the first article */}
              {data.length > 0 && (
                <div
                  key={data[0].$id}
                  className={`grid-div ${data[0].$id === data[0].$id ? "span-two-rows" : ""}`}
                  style={{ backgroundImage: `url('${data[0].image}')` }}
                  onClick={() =>
                    (window.location.href = `/blog/${data[0].slug}`)
                  }
                >
                  <a href={`/blog/${data[0].slug}`}>
                    <div className="grid-text">
                      <p style={{ fontSize: "1.1rem" }}>{data[0].title}</p>
                    </div>
                  </a>
                </div>
              )}

              {/* Render the other two articles */}
              {data.slice(1, 3).map((item) => (
                <div
                  key={item.slug}
                  className="grid-div"
                  style={{ backgroundImage: `url('${item.image}')` }}
                  onClick={() => (window.location.href = `/blog/${item.slug}`)}
                >
                  <a href={`/blog/${item.slug}`}>
                    <div className="grid-text">
                    <p style={{ fontSize: "1.1rem" }}>{item.title}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <SubscribePopup isOpen={isPopupOpen} onClose={closePopup} />

    </div>
  );
}

export default Home;
