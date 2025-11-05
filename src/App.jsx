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
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("interstellar");

  /*
  // CALLING API USING FETCH REQUEST
  useEffect(() => {
    fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=interstellar`)
      .then((res) => res.json())
      .then((data) => setMovies(data.Search));
  }, []);
  */

  // CALLING API USING ASYNC AWAIT
  useEffect(() => {
    async function fetchMovies() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
      );
      const data = await res.json();
      setMovies(data.Search);
      setIsLoading(false);
    }

    fetchMovies();
  }, [query]);

  function handleSearch(e) {
    setQuery(e.target.value);
  }

  return (
    <>
      {/* Component composition using children to prevent or reduce prop drilling */}
      <Nav query={query} onSearch={handleSearch}>
        <ResultCount movies={movies} />
      </Nav>

      <Main>
        {/* PASSING ELEMENT AS PROPS: We can now receive our element  props here as props 
        <Box element={<MovieList movies={movies} />} />
        */}
        <Box>{isLoading ? <Loader /> : <MovieList movies={movies} />}</Box>

        <Box>
          <WatchSummary watched={watched} />
          <WatchedList watched={watched} />
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <div className="loader-container">
      <span class="loader"></span>
      <p>Loading...</p>
    </div>
  );
}
export default App;
