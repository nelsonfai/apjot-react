import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";

function ArticleCard({ article, width = '100%', height = "250px", fontsize = '1.17rem' }) {
  return (
    <article style={{ width: width }}>
      <div>
      <Link href={`/blog/${article.slug}`} style={{ fontWeight: 300, fontSize: fontsize }}>
        <div
          className="article_image"
          style={{
            background: `url('${article.image}')`,
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            marginBottom: 5,
            width: width,
            height: height
          }}
        />
        </Link>
        <div className="article_element">
          <h3>
            <Link href={`/blog/${article.slug}`} style={{ fontWeight: 300, fontSize: fontsize }}>
              {article.title}
            </Link>
          </h3>
        </div>
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
