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
  getRelated,
  deleteHighlight
} from "../lib/context/article";
import { Helmet } from 'react-helmet';
import ArticleCard from "../components/ArticleCard";
import { Link } from "react-router-dom"; // Import Link from React Router

function ArticleDetails({ match }) {
  const [data, setData] = useState(null);
  const [relData, setRelData] = useState(null);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] =useState(false)
  const [comments, setComments] = useState([]);
  const [audio, setAudio] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [playAction, setPlayAction] = useState("Listen");
  const [showHighlights, setShowHighlights] = useState(false);
  const [message, setMessage] = useState("");
  const [replyMessage, setReplyMessage] = useState("");
  const { current: user } = useUser();
  const [name, setName] = useState(user?.name || "Guest");
  const [highlights, setHighlights] = useState([]);
  const { slug } = match.params;
  const commentsRef = useRef(null); // Create a ref for the comments section
  const [replyingTo, setReplyingTo] = useState(null); // State to track the comment being replied to

  function handleHighlight() {

    setLoading(true)
    const selection = window.getSelection();
    const text = selection.toString().trim();
    if (text.length !== 0) {
      createHighlight(data.$id, text,user?.$id)
        .then((newHighlight) => {
          if (newHighlight) {
            setHighlights([...highlights, newHighlight]);
            setLoading(false)
          }
        })
        .catch((error) => {
          setLoading(false)

          console.error("Error creating highlight:", error);
        });
    }
  }
  const handleDeleteHighlight = (highlightId) => {
    setLoading(true);
    deleteHighlight(highlightId)
      .then(() => {
        setHighlights(highlights.filter((highlight) => highlight.$id !== highlightId));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error deleting highlight:", error);
      });
  };
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };


function arrangeComments(comments) {
  const parents = [];
  const replies = [];

  // Separate comments into parents and replies
  comments.forEach(comment => {
      if (comment.parent === null) {
          parents.push(comment);
      } else {
          replies.push(comment);
      }
  });
  replies.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Iterate through replies and insert them directly after their parent
  replies.forEach(reply => {
      const parentIndex = parents.findIndex(parent => parent.$id === reply.parent);
      if (parentIndex !== -1) {
          parents.splice(parentIndex + 1, 0, reply); // Insert reply after its parent
      } else {
          console.error(`Parent comment with ID ${reply.parent} not found.`);
      }
  });
  setComments(parents)
  return ;
}




  useEffect(() => {
    getDocumentById(slug).then((data) => {
      setData(data);
      setLikeCount(data?.applauds);
      arrangeComments(data.comments)
      if (data) {
        getAllHighlights(data.$id,user?.$id).then((highlightsData) => {
          setHighlights(highlightsData);
        });
        getRelated().then((data) =>{
          setRelData(data)
        })
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

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
    setLikeCount(likeCount + 1);
    executeFunction(data.$id).then((data) => {
      if (data) {
       // setLikeCount(likeCount + 1);
      }
    });
  };

  const handleSubmit = (e, parentCommentId = null) => {
    e.preventDefault();
  
    if (message.trim().length === 0 ) {
        return;
      }

    const currentDate = new Date();
    createComment(data.$id, name, message, currentDate, parentCommentId)
      .then((newComment) => {
        arrangeComments([...comments, newComment]);
        setName(user?.name || "Guest");
        setMessage("");
        setReplyingTo(null); // Reset replyingTo state after submitting a comment
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
                  }}
                >
                  <p key={index}>{highlight.text}</p>
                  <button
                    style={{
                      padding: "5px 7px",
                      border: 0,
                      backgroundColor: "whitesmoke",
                      cursor: "pointer",
                      marginTop:10
                    }}
                    onClick={() => handleDeleteHighlight(highlight.$id)}

                  >
                    {" "}
                    Delete
                  </button>
                </li>
              ))}
            {highlights.length ==0 && <p> You have no highlights for the Article</p>}
          </ul>
        </div>
      ) : (
        <div>
          {user && (
            <div className="floatHiglight">
              <button
                className="higlightbutton"
                onClick={handleHighlight}
                disabled={loading}>
                <img src="/textmarker.png" alt="" width="25px" height="25px" />
              </button>
            </div>
          )}
          <h1 className="title">{data?.title}</h1>
          <p className="tagline">{data?.tagline}</p>
          { data?.created && <p className="date">{formatDate(data?.created)}</p>}
          <div className="article_actions">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <button className="button" onClick={handleLike}>
                <img src="/clapping.png" alt="Applauds" />
                <span style={{ fontSize: "16px", color: "black" }}>
                  {" "}
                  {likeCount}
                </span>
              </button>
              <button className="button" onClick={scrollToComments}>
                {" "}
                {/* Modify onClick to scroll to comments */}
                <img src="/bubble.png" alt="Comments" />
                <span style={{ fontSize: "16px", color: "black" }}>
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
                  <img src="/textmarker.png" alt="Share" /> { highlights.length}
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
          { data?.image && <div style={{ marginBottom: "1rem" }}>
            <img src={`${data?.image}`} alt="" width="100%" />
          </div>}
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
              
          <div className="hideScroll" style={{display:'flex',gap:5,overflowX:'scroll',marginBlock:10}}>
              {relData &&
              relData.map((article, index) => (
                <Link to={`/blog/${article.slug}`} > 
                  <ArticleCard  article={article} key={article.$id} width="250px" height="150px" fontsize="16px"/>
                </Link>
              ))}
          </div>
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
                  <div key={index} style={{ marginBottom: "1rem", backgroundColor: comment.parent ? '#f2f2f2' : 'transparent', padding: comment.parent ? 15 : 0,borderLeft: comment.parent ? '2px solid black' : 'none' }}>

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
                    {!user && !comment.parent && (
                      <p> 
                      <button
                        onClick={() => setReplyingTo(comment.$id)}
                        style={{ marginRight: "10px",border:'none',backgroundColor:'white',color:'grey' }}
                      >
                        Reply
                      </button>
                     {replyingTo === comment.$id && <button
                        onClick={() => setReplyingTo(null)}
                        style={{ marginRight: "10px",border:'none',backgroundColor:'white',color:'grey' }}
                      >
                        Cancel
                      </button>}
                      </p>
                    )}
                    {replyingTo === comment.$id && (
                      <form onSubmit={(e) => handleSubmit(e, comment.$id)} style={{marginTop:'20px'}}>
                              {!user &&      <div>
                                    <label htmlFor="name">Name:</label>
                                    <input
                                      id="name"
                                      type="text"
                                      placeholder="Your name"
                                      value={name}
                                      onChange={(e) => setName(e.target.value)}
                                      style={{ marginTop: '10px',padding:'10px', marginTop:'10px' }}
                                    />
                                  </div>}
                        <div style={{marginTop:'10px'}}>
                          <textarea
                            placeholder="Reply to this comment"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                          ></textarea>
                        </div>
                        <button type="submit">Reply</button>
                      </form>
                    )}

                    {/* Render replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div style={{ marginLeft: "20px" }}>
                        {comment.replies.map((reply, replyIndex) => (
                          <div key={replyIndex} style={{ marginBottom: "0.5rem" }}>
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
                                {reply.name.charAt(0).toUpperCase()}
                              </span>
                              <p>{reply.name}</p>
                            </div>
                            <p>{reply.message}</p>
                            <small style={{ fontSize: 12, color: "grey" }}>
                              {formatDate(reply.date)}
                            </small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
       { !replyingTo &&  <div>
            <form onSubmit={handleSubmit} >
          {!user &&  <div>
                <label htmlFor="name" >Name:</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ marginTop: '10px',padding:'10px' }}
                />
              </div>}
              <div>
                <label htmlFor="message">Message:</label>
              
                <textarea
                  id="message"
                  required
                  placeholder="Leave a comment here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{marginTop:'10px'}}
                ></textarea>
              </div>
              <button type="submit" style={{ maxWidth: "100px" }}>
                Comment
              </button>
            </form>
          </div>}

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
