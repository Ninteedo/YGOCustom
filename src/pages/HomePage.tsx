import React, {useEffect} from "react";
import {Link} from "react-router-dom";

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = `$YuGiOh Custom Cards | rgh.dev`;
  }, []);

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
