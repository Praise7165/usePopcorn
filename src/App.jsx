import "./App.css";
import { useEffect, useState } from "react";
import Nav from "./assets/components/Nav";
import Main from "./assets/components/Main";
import { tempMovieData } from "../data";
import { tempWatchedData } from "../data";

import ResultCount from "./assets/components/ResultCount";
import MovieList from "./assets/components/MovieList";
import Box from "./assets/components/Box";
import WatchSummary from "./assets/components/WatchSummary";
import WatchedList from "./assets/components/WatchedList";

const KEY = "518dc1f1";

// Prop drilling is the passing of a prop through several nested child component so as to get a data to deeply nested component.
function App() {
  // const [movies, setMovies] = useState(tempMovieData);
  // const [watched, setWatched] = useState(tempWatchedData);

  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
      .then((res) => res.json())
      .then((data) => setMovies(data.Search));
  }, []);

  return (
    <>
      {/* Component composition using children to prevent or reduce prop drilling */}
      <Nav>
        <ResultCount movies={movies} />
      </Nav>

      <Main>
        {/* PASSING ELEMENT AS PROPS: We can now receive our element  props here as props 
        <Box element={<MovieList movies={movies} />} />
        */}
        <Box>
          <MovieList movies={movies} />
        </Box>

        <Box>
          <WatchSummary watched={watched} />
          <WatchedList watched={watched} />
        </Box>
      </Main>
    </>
  );
}

export default App;
