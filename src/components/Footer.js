// Footer component
import React from "react";

const Footer = () => {
  return (
    <div>
      {/* Newsletter section */}
      <div
        style={{
          padding: "2rem 1rem",
          textAlign: "center",
          borderTop: "1px solid rgba(17, 17, 26, 0.1)",
          marginTop: "2rem",
        }}
        id="subscribeToNewsletter"
      >
        <h3 style={{ fontSize: "xx-large" }}>Join Our Weekly Newletter</h3>
        <p style={{ textAlign: "center", marginBlock: "1rem" }}>
          Ignite Your Mind with Apjots Weekly Newsletter: Explore Deep Insights,
          Thought-Provoking Content, and Exclusive Updates
        </p>
        <form
          action="/blog/subscribe/"
          method="post"
          style={{
            display: "flex",
            width: "100%",
            maxWidth: "600px",
            margin: "auto",
          }}
          id="newsletterForm"
        >
          <input
            type="email"
            name="subscribeEmail"
            id="subscribeEmail"
            placeholder="Enter email address"
            style={{
              padding: "1rem",
              width: "100%",
              fontSize: "large",
              flex: "2",
            }}
            required
          />
          <input
            type="text"
            value="nMktA8PFzbDaah6Sbb5c862gXTHjdNzvFaiVxoqtw4lfx2OP4Q6AZiF2NUhX6Byq"
            name="token"
            id="token"
            hidden
          />
          <input
            type="submit"
            value="Subscribe"
            style={{
              padding: "1rem",
              backgroundColor: "black",
              color: "white",
              flex: "1",
            }}
          />
        </form>
        <p
          style={{ textAlign: "center", marginTop: "1rem" }}
          id="successMessage"
        ></p>
      </div>
      <footer>
        <div className="social">
          <a
            href="https://www.instagram.com/apjot.blog/"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            <i
              className="fa-brands fa-instagram"
              style={{ fontSize: "25px" }}
            ></i>{" "}
          </a>
          <a href="mailto:nelsonfai21@yahoo.com">
            <i
              className="fa-regular fa-envelope"
              style={{ fontSize: "25px" }}
            ></i>{" "}
          </a>
        </div>
        <ul className="list-inline">
          <li className="list-inline-item">
            <a href="/">Home</a>
          </li>
          <li className="list-inline-item">
            <a href="/blog/">Blog</a>
          </li>
          <li className="list-inline-item">
            <a href="/about/">About</a>
          </li>
        </ul>
        <p hidden>eamil....</p>
        <p className="copyright">Apjot© 2023</p>
      </footer>
    </div>
  );
};

export default Footer;
