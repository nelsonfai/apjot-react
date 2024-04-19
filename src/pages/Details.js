import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { useUser } from "../lib/context/user";
import FormattedText from "../components/FormattedText";
import {
  getDocumentById,
  executeFunction,
  createComment,
  getAllHighlights,
  createHighlight,
  getRelated
} from "../lib/context/article";
import { Helmet } from 'react-helmet';
import ArticleCard from "../components/ArticleCard";

function ArticleDetails({ match }) {
  const [data, setData] = useState(null);
  const [relData, setRelData] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [audio, setAudio] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playAction, setPlayAction] = useState("Listen");
  const [showHighlights, setShowHighlights] = useState(false);
  const [message, setMessage] = useState("");
  const { current: user } = useUser();
  const [name, setName] = useState(user?.name || "Guest");
  const [highlights, setHighlights] = useState([]);
  const { slug } = match.params;
  const commentsRef = useRef(null); // Create a ref for the comments section

  function handleHighlight() {
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text.length !== 0) {
      createHighlight(data.$id, text)
        .then((newHighlight) => {
          if (newHighlight) {
            setHighlights([...highlights, newHighlight]);
          }
        })
        .catch((error) => {
          console.error("Error creating highlight:", error);
        });
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  useEffect(() => {
    getDocumentById(slug).then((data) => {
      setData(data);
      setLikeCount(data?.applauds);
      setComments(data.comments);
      if (data) {
        getRelated().then((data) =>{
          setRelData(data)
        })
      }
    });
  }, [slug]);

  const handlePlayPause = () => {
    if (audio.paused) {
      audio.play();
      setPlaying(true);
      setPlayAction("Pause");
    } else {
      audio.pause();
      setPlaying(false);
      setPlayAction("Play");
    }
  };

  useEffect(() => {
    if (data && data.audio) {
      const audioElement = new Audio(data.audio);
      setAudio(audioElement);
    }
  }, [data]);

  const handleLike = async () => {
    executeFunction(data.$id).then((data) => {
      if (data) {
        setLikeCount(likeCount + 1);
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim().length === 0) {
      return;
    }
    const currentDate = new Date();
    createComment(data.$id, name, message, currentDate)
      .then((newComment) => {
        setComments([...comments, newComment]);
        setName(user?.name || "Guest");
        setMessage("");
      })
      .catch((error) => {
        console.error("Error creating comment:", error);
      });
  };

  const scrollToComments = () => {
    commentsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const handleShare = async () => {
    try {
        if (navigator.share) {
            const shareData = {
                title: data?.title,
                text: data?.tagline,
                url: window.location.href,
            };
            await navigator.share(shareData);
            console.log('Shared successfully');
        } else {
            // Fallback behavior if Web Share API is not supported
            console.log('Web Share API not supported');
        }
    } catch (error) {
        console.error('Error sharing:', error);
    }
};

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: "800px",
        margin: "auto",
        width: "100%",
      }}>
      <Helmet>
          <meta name="description" content={data?.meta_description} />
          <meta name="keywords" content={data?.meta_keywords} />
      </Helmet>
      {showHighlights ? (
        <div style={{ minHeight: "100vh" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              paddingBlock: "1rem",
            }}>
            <h2>Highlights</h2>
            <button
              onClick={() => setShowHighlights(false)}
              style={{
                padding: "8px 15px",
                border: 0,
                backgroundColor: "whitesmoke",
                cursor: "pointer",
              }}>
              Close
            </button>
          </div>
          <ul>
            {highlights &&
              highlights.map((highlight, index) => (
                <li
                  style={{
                    padding: "14px",
                    marginBlock: "1rem",
                    border: "1px solid whitesmoke",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p key={index}>{highlight.text}</p>
                  <button
                    style={{
                      padding: "5px 7px",
                      border: 0,
                      backgroundColor: "whitesmoke",
                      cursor: "pointer",
                    }}
                  >
                    {" "}
                    Delete
                  </button>
                </li>
              ))}
            <p> You have no highlights for the Article</p>
          </ul>
        </div>
      ) : (
        <div>
          {user && (
            <div className="floatHiglight">
              <button onClick={handleHighlight}>
                <img src="/textmarker.png" alt="" width="25px" height="25px" />
              </button>
            </div>
          )}
          <h1 className="title">{data?.title}</h1>
          <p className="tagline">{data?.tagline}</p>
          <p className="date">{formatDate(data?.created)}</p>
          <div className="article_actions">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <button className="button" onClick={handleLike}>
                <img src="/clapping.png" alt="Applauds" />
                <span style={{ fontsize: "16px", color: "black" }}>
                  {" "}
                  {likeCount}
                </span>
              </button>
              <button className="button" onClick={scrollToComments}>
                {" "}
                {/* Modify onClick to scroll to comments */}
                <img src="/bubble.png" alt="Comments" />
                <span style={{ fontsize: "16px", color: "black" }}>
                  {" "}
                  {comments.length}
                </span>
              </button>
              
             {navigator.share && <button className="button"  onClick={handleShare}>
                <img src="/share.png" alt="Share" />
              </button>}
              {user && (
                <button
                  className="button"
                  onClick={() => setShowHighlights(true)}
                >
                  <img src="/textmarker.png" alt="Share" />
                </button>
              )}
            </div>
            <div className="audio_actions">
                {data?.audio ? (
                  <audio controls>
                    <source src={data.audio} type="audio/ogg" />
                    <source src={data.audio} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  null  
              )}
            </div>

          </div>
          <div style={{ marginBottom: "1rem" }}>
            <img src={`${data?.image}`} alt="" width="100%" />
          </div>
<div className="audio_inline">
  {data?.audio ? (
    <div>
      <p style={{fontWeight: "bold"}}>Listen to article</p>
      <audio controls style={{marginTop: 10}}>
        <source src={data.audio} type="audio/ogg" />
        <source src={data.audio} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  ) : null}
</div>

      
                <FormattedText body={data?.body} highlights={highlights} />
          <p>{data?.author}</p>
          <p style={{ marginBlock: "1rem" }}>
            Tags:{" "}
            {data?.tags &&
              data.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  {index !== data.tags.length - 1 && " "}
                </span>
              ))}
          </p>


          <div ref={commentsRef}>
            {" "}
            {/* Set ref to comments section */}
            <h2>Comments</h2>
            <div
              style={{
                marginBlock: "1rem",
                paddingBlock: "1rem",
                borderTop: "1px solid whitesmoke",
              }}
            >
              {comments.length === 0 ? (
                <p>No comments yet.</p>
              ) : (
                comments.map((comment, index) => (
                  <div key={index} style={{ marginBottom: "1rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        marginBottom: 5,
                      }}
                    >
                      <span
                        style={{
                          width: "35px",
                          height: "35px",
                          border: "1px solid #ccc",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                        }}
                      >
                        {comment.name.charAt(0).toUpperCase()}
                      </span>
                      <p>{comment.name}</p>
                    </div>
                    <p>{comment.message}</p>
                    <small style={{ fontSize: 12, color: "grey" }}>
                      {formatDate(comment.date)}
                    </small>
                  </div>
                ))
              )}
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="message">Message:</label>
                <textarea
                  id="message"
                  placeholder="Leave a comment here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" style={{ maxWidth: "100px" }}>
                Comment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

ArticleDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      slug: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default ArticleDetails;
