import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Import Link from React Router

function ArticleCard({ article,width='100%', height="250px", fontsize='1.17rem' }) {
  return (
    <article style={{width:width}}>
      <div
        className="article_image"
        style={{
          background: `url('${article.image}')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          marginBottom:5,
          width:width,
          height:height
        }}>

        </div>
      <div className="article_element">
        <h3 >
          <Link to={`/blog/${article.slug}`} style={{ fontWeight: 300, fontSize:fontsize  }}>
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
