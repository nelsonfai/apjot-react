'use client'
import React, { useEffect, useState } from 'react';
import { useUser } from "@/lib/context/user";
import { createHighlight, deleteHighlight, getAllHighlights } from "@/lib/context/article";
import { useHighlights } from '@/lib/context/highlight';

const Highlight = ({ articleId, highlights, setHighlights, showHighlights, setShowHighlights, loginPrompt, setLoginPrompt }) => {
  const { current: user } = useUser();
  const [loading, setLoading] = useState(false);
  const [loginPromptMessage, setLoginPromptMessage] = useState('You need to be logged in to use this feature.');

  const handleHighlight = () => {
    if (!user) {
      setLoginPrompt(true); 
      return;
    }
  
    console.log('Got the handle');
    setLoading(true);
    
    // Retrieve the latest selection
    const selection = window.getSelection();
    const text = selection.toString().trim();
    console.log('Selected text:', text);
  
    if (text.length !== 0 && articleId) {
      createHighlight(articleId, text, user?.$id)
        .then((newHighlight) => {
          if (newHighlight) {
            console.log('New highlight created:', newHighlight);
            setHighlights((prevHighlights) => [...prevHighlights, newHighlight]);
            selection.removeAllRanges(); // Clear selection
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error creating highlight:", error);
        });
    } else {
      setLoginPromptMessage('You need to select a text before highlighting');
      setLoginPrompt(true);
      setLoading(false); // Ensure loading is turned off
    }
  };
  

  const handleDeleteHighlight = (highlightId) => {
    if (!user) {
      setLoginPrompt(true); // Show login prompt if not logged in
      return;
    }
    setLoading(true);
    deleteHighlight(highlightId)
      .then(() => {
        setHighlights((prevHighlights) =>
          prevHighlights.filter((highlight) => highlight.$id !== highlightId)
        );
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error deleting highlight:", error);
      });
  };

  const handleLoginPromptClose = () => {
    setLoginPrompt(false);
    // Optionally, redirect to login page
    // window.location.href = '/login'; // or use a router to navigate
  };

  return (
    <>
      {loginPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            textAlign: 'center',
            maxWidth: '400px',
            width: '100%',
          }}>
            <p>{loginPromptMessage}</p>
            <button onClick={handleLoginPromptClose} style={{
              marginTop: '1rem',
              padding: '8px 15px',
              border: 0,
              backgroundColor: 'whitesmoke',
              cursor: 'pointer',
              borderRadius: '4px',
            }}>
              Close
            </button>
          </div>
        </div>
      )}

      {showHighlights && (
        <div style={{    
          minHeight: '100vh',
          position: 'fixed',
          width: '100%',
          top: 0,
          backgroundColor:' white',
          left: 0,
          zIndex: 100,
          padding: '1rem',


           }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "sticky",
              top: 0,
              backgroundColor: "white",
              paddingBlock: "1rem",
            }}
          >
            <h2>Highlights</h2>
            <button
              onClick={() => setShowHighlights(false)}
              style={{
                padding: "8px 15px",
                border: 0,
                backgroundColor: "whitesmoke",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>
          <ul>
            {highlights.map((highlight) => (
              <li
                key={highlight.$id}
                style={{
                  padding: "14px",
                  marginBlock: "1rem",
                  border: "1px solid whitesmoke",
                }}
              >
                <p>{highlight.text}</p>
                <button
                  style={{
                    padding: "5px 7px",
                    border: 0,
                    backgroundColor: "whitesmoke",
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                  onClick={() => handleDeleteHighlight(highlight.$id)}
                >
                  Delete
                </button>
              </li>
            ))}
            {highlights.length === 0 && <p>You have no highlights for the Article</p>}
          </ul>
        </div>
      )}

      <div className="floatHighlight">
        <button
          className="highlightbutton"
          onClick={handleHighlight}
          disabled={loading}
        >
          <img src="/textmarker.png" alt="highlight counter" width="25px" height="25px" />
        </button>
      </div>
    </>
  );
};

export const HighlightButton = ({ iniHighlights, articleId }) => {
  const [showHighlights, setShowHighlights] = useState(false);
  const [highlights, setHighlights] = useState(iniHighlights || []);
  const [loginPrompt, setLoginPrompt] = useState(false);
  const { setHighlightGlobal } = useHighlights();
  const { current: user } = useUser(); 

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const fetchedHighlights = await getAllHighlights(articleId);
        setHighlights(fetchedHighlights)
      } catch (error) {
        console.error("Error fetching highlights:", error);
      }
    };

    fetchHighlights();
  }, [articleId]);

  useEffect(() => {
    setHighlightGlobal(highlights)
  },[highlights])

  const toggleHighlights = () => {
    if (!user) {
      setLoginPrompt(true); 
      return;
    }
    setShowHighlights(!showHighlights);
  };

  return (
    <>
      <button className="button" onClick={toggleHighlights}>
        <img src="/textmarker.png" alt="highlight counter" />
        <span style={{ fontSize: "16px", color: "black" }}>
          {highlights.length}
        </span>
      </button>
      <Highlight
        articleId={articleId}
        highlights={highlights}
        setHighlights={setHighlights}
        showHighlights={showHighlights}
        setShowHighlights={setShowHighlights}
        loginPrompt={loginPrompt} // Pass loginPrompt state
        setLoginPrompt={setLoginPrompt} // Pass setLoginPrompt function
      />
    </>
  );
};
