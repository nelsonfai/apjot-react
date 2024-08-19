import React from 'react';
import PropTypes from 'prop-types';
import FormattedText from '@/components/FormattedText';
import ArticleCard from '@/components/ArticleCard';
import { getDocumentById, getRelated } from '@/lib/context/article';
import LikeButton from '@/components/LikeButton';
import CommentsSection from '@/components/CommentsSection';
import "../blog.css";
import CommentCounter from '@/components/CommentCounter';
import { HighlightButton } from '@/components/Highlights';

export async function generateStaticParams() {
  const articles = await getRelated(); 
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function getArticleData(slug) {
  const data = await getDocumentById(slug);
  const relatedArticles = await getRelated();
  return { data, relatedArticles };
}

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString();
};

const ArticleDetails = async ({ params }) => {
  const { slug } = params;
  const { data, relatedArticles } = await getArticleData(slug);

  // Dynamically update metadata
  return (
    <>
      {/* Metadata Configuration */}
      <title>{data?.title || "Article Title Here"}</title>
      <meta name="description" content={data?.meta_description || "Default description"} />
      <meta name="keywords" content={data?.meta_keywords?.join(", ") || ""} />

      <div style={{ padding: '1rem', maxWidth: '800px', margin: 'auto', width: '100%' }}>
        <h1 className="title">{data?.title}</h1>
        <p className="tagline">{data?.tagline}</p>
        {data?.created && <p className="date">{formatDate(data?.created)}</p>}
        <div className="article_actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LikeButton initialCount={data?.applauds} articleId={data.$id} />
            <CommentCounter initialCount={data?.comments?.length} articleId={data.$id} />
            <HighlightButton articleId={data.$id} />
          </div>
          <div className="audio_actions">
            {data?.audio && (
              <audio controls>
                <source src={data.audio} type="audio/ogg" />
                <source src={data.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }} className="detailImage">
          <img src={data?.image} alt="" width="100%" />
        </div>
        <div className="audio_inline">
          {data?.audio && (
            <div>
              <p style={{ fontWeight: 'bold' }}>Listen to article</p>
              <audio controls style={{ marginTop: 10 }}>
                <source src={data.audio} type="audio/ogg" />
                <source src={data.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        <FormattedText body={data?.body} />
        <p>{data?.author}</p>
        <p style={{ marginBlock: '1rem' }}>
          Tags: {data?.tags && data.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}{index !== data.tags.length - 1 && ' '}
            </span>
          ))}
        </p>
        <CommentsSection articleId={data.$id} initialComments={data?.comments} />
        <div className="hideScroll" style={{ display: 'flex', gap: 5, overflowX: 'scroll', marginBlock: 10 }}>
          {relatedArticles && relatedArticles.map((article) => (
            <ArticleCard article={article} width="250px" height="150px" fontsize="16px" />
          ))}
        </div>
      </div>
    </>
  );
};

ArticleDetails.propTypes = {
  params: PropTypes.shape({
    slug: PropTypes.string.isRequired,
  }).isRequired,
};

export default ArticleDetails;
