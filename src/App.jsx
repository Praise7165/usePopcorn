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
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

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
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`
        );
        if (!res.ok)
          throw new Error("something went wrong with fetching movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error(`Movie not found`);

        setMovies(data.Search);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("Enter a movie name to start searching");
      return;
    }

    fetchMovies();
  }, [query]);

  function handleSearch(e) {
    setQuery(e.target.value);
  }

  function handleSelectMovie(id) {
    setSelected((selected) => (selected === id ? null : id));
  }

  function handleCloseMovie() {
    setSelected(null);
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
        <Box>
          {!isLoading && !error && (
            <MovieList movies={movies} onClick={handleSelectMovie} />
          )}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selected ? (
            <MovieDetails selected={selected} onClick={handleCloseMovie} />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <WatchedList watched={watched} />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return (
    <div className="loader-container">
      <span className="loader"></span>
      <p>Loading...</p>
    </div>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⚠️</span>
      {message}
    </p>
  );
}

function MovieDetails({ selected, onClick }) {
  const [movie, setMovie] = useState({});

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    async function getMovieDetails() {
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selected}`
      );

      if (!res.ok) throw new Error("something went wrong with fetching movies");

      const data = await res.json();

      setMovie(data);
    }

    getMovieDetails();
  }, [selected]);
  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onClick}>
          &larr;
        </button>
        <img src={poster} alt={`poster of ${title}`} />
        <div className="details-overview">
          <h2>{title}</h2>
          <p>
            {released} &bull; {runtime}
          </p>
          <p>{genre}</p>
          <p>
            <span>⭐</span>
            {imdbRating} IMDb rating
          </p>
        </div>
      </header>

      <section>
        <p>
          <em>{plot}</em>
        </p>
        <p>Starring {actors}</p>
        <p>Directed by {director}</p>
      </section>
    </div>
  );
}

export default App;
