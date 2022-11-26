import React from "react";
import { Link } from "react-router-dom";

const nav = () => {
  return (
    <nav>
      <span>
        <Link to="/">Login</Link>
      </span>
      <span>
        <Link to="/Join">Join</Link>
      </span>
    </nav>
  );
};

export default nav;
