import "./App.css";
import { useState } from "react";
import Nav from "./assets/components/Nav";
import Main from "./assets/components/Main";
import { tempMovieData } from "../data";

function App() {
  const [movies, setMovies] = useState(tempMovieData);

  return (
    <>
      <Nav movies={movies} />
      <Main movies={movies} />
    </>
  );
}

export default App;
