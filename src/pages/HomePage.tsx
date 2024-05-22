import React from "react";
import {Link} from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <h2>Archetypes</h2>
      <ul>
        <Link to={"../archetypes/Dragonmaid"}>Dragonmaid</Link>
      </ul>
    </div>
  );
}

export { HomePage }
