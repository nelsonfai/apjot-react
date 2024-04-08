import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Import Link from React Router

function ArticleCard({ article }) {
  return (
    <article>
      <div
        className="article_image"
        style={{
          background: `url('${article.image}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div className="article_element">
        <h3>
          <Link to={`/blog/${article.slug}`} style={{ fontWeight: 200 }}>
            {article.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}

ArticleCard.propTypes = {
  article: PropTypes.shape({
    image: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ArticleCard;
