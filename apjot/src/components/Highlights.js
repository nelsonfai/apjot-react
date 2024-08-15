'use client'
import { useState } from "react";
import { useUser } from "@/lib/context/user";
import { createHighlight,deleteHighlight } from "@/lib/context/article";
const Highlight = ({data}) => {
    const {user} = useUser()
    console.log('uSER HIGHLIGHT',user)
    const [showHighlights, setShowHighlights] = useState(false);
    const [highlights, setHighlights] = useState([]);
    const [loading, setLoading] =useState(false)

    function handleHighlight() {
        setLoading(true)
        const selection = window.getSelection();
        const text = selection.toString().trim();
        if (text.length !== 0) {
          createHighlight(data.$id, text, user?.$id)
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
      
return(
    <>
    <ul>
    {!showHighlights ? (
        <div style={{ minHeight: "100vh"}}>

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
                  }}>
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
            {highlights.length == 0 && <p> You have no highlights for the Article</p>}
          </ul>
        </div>
      ) : (
        <div>
          {!user && (
            <div className="floatHighlight">
              <button
                className="higlightbutton"
                onClick={handleHighlight}
                disabled={loading}>
                <img src="/textmarker.png" alt="" width="25px" height="25px" />
              </button>
            </div>
          )}
          </div>
          )
          }
    </ul>
              {!user && (
                <div className="floatHighlight">
                  <button
                    className="highlightbutton"
                    onClick={handleHighlight}
                    disabled={loading}>
                    <img src="/textmarker.png" alt="" width="25px" height="25px" /> 
                  </button>
                </div>
              )}
    </>

);
}
export default Highlight