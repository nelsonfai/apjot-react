'use client'

import { useUser } from "@/lib/context/user";
import './about.css'
function About() {

  const user = useUser();
  return (
    <div>
    <div className="about-container">
        <div className="about">
          <h3> Hi {user?.name} { !user?.name && 'there'}! So Glad You&#39;re Here. </h3>
          <br />
          <p>
            Apjot is a blog that takes an introspective look into our modern
            society with focus on self growth.
            <br />
            <br />
            My writings are driven by my curiosity and not a certainty of truth.
            It is my belief that the truth is one we can never know for sure but
            we can get closer to by constantly filtering our known truths
            through a series of logical arguments. Our minds remains our most
            valuable tool of asserting what we would consider as true and with
            time and more information our views change.
            <br />
            <br />
            Apjot stands as a tangible product of all my mental dialogues <br />
            My views and yours may or may not align at all times but by sharing
            and understanding each others point of view, we get closer to the
            Truth.
            <br />
            <br />
            Welcome to this public journal of thoughts Where every thought
            counts and is worth sharing!
          </p>
          <br />
          <p className="contact">
            Email:{" "}
            <a href="mailto:nelsonfai21@yahoo.com">nelsonfai21@yahoo.com</a>
          </p>
        </div>
      </div>
      <div className="wordart">
        <img src="/wordart.png" alt="wordart" width="100%" />
      </div>
      <p className="tagline" style={{ textAlign: "center" }}>
        {" "}
        <strong> Self-growth through Self-Exploration</strong>{" "}
      </p>
    </div>
  );
}

export default About;
