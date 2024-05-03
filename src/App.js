import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Blog from "./pages/Blog";
import ArticleDetails from "./pages/Details";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProfilePage from "./pages/Profile";
import PasswordRecoveryInitiationPage from "./pages/PasswordRecoveryInitiationPage";
import PasswordRecoveryConfirmationPage from "./pages/PasswordRecoveryConfirmationPage";
import { UserProvider } from "./lib/context/user";

import Footer from "./components/Footer";
import Header from "./components/Header";

export default function App() {
  return (
    <UserProvider>
      <div>
        <Header />
        <main>
          <Router>
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/blog" exact component={Blog} />
              <Route path="/about" component={About} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={Signup} />
              <Route path="/profile" component={ProfilePage} />
              <Route path="/password-recovery" exact component={PasswordRecoveryInitiationPage} />
              <Route path="/password-recovery/confirm" exact component={PasswordRecoveryConfirmationPage} />
              <Route path="/blog/:slug" component={ArticleDetails} />
            </Switch>
          </Router>
        </main>
        <Footer />
      </div>
    </UserProvider>
  );
}