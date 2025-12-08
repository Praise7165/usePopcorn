import "./App.css";
import { useEffect, useState } from "react";
import Nav from "./assets/components/Nav";
import Main from "./assets/components/Main";

import ResultCount from "./assets/components/ResultCount";
import MovieList from "./assets/components/MovieList";
import Box from "./assets/components/Box";
import WatchSummary from "./assets/components/WatchSummary";
import WatchedList from "./assets/components/WatchedList";
import StarRating from "./assets/components/StarRating";

const KEY = "518dc1f1";

// Prop drilling is the passing of a prop through several nested child component so as to get a data to deeply nested component.
function App() {
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
    const controller = new AbortController();

    async function fetchMovies() {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
          { signal: controller.signal }
        );
        if (!res.ok)
          throw new Error("something went wrong with fetching movies");

        const data = await res.json();

        if (data.Response === "False") throw new Error(`Movie not found`);

        setMovies(data.Search);
        setError("");
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    if (query.length < 3) {
      setMovies([]);
      setError("Enter a movie name to start searching");
      return;
    }

    //close movie details before searching for movies
    handleCloseMovie();
    fetchMovies();

    return () => controller.abort();
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

  function handleAddToWatchedList(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleDeleteFromWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
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
          <div className={`${(isLoading || error) && "centered"}`}>
            {!isLoading && !error && (
              <MovieList movies={movies} onClick={handleSelectMovie} />
            )}
            {isLoading && <Loader />}
            {error && <ErrorMessage message={error} />}
          </div>
        </Box>

        <Box>
          {selected ? (
            <MovieDetails
              selected={selected}
              watched={watched}
              onCloseMovie={handleCloseMovie}
              onAddMovie={handleAddToWatchedList}
            />
          ) : (
            <>
              <WatchSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDelete={handleDeleteFromWatched}
              />
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

function MovieDetails({ selected, watched, onCloseMovie, onAddMovie }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState(null);

  // DERIVED STATE

  // map create a new array that contains all the watched movie id. then we use includes method on the returned array to know if the id of the movie we are selecting is there.
  const isWatched = [...watched]
    .map((movie) => movie.imdbID)
    .includes(selected);

  // we can also write it this way
  // let isWatched = [...watched].some((movie) => movie.imdbID === selected);

  // here we find the object whose id is same as the selected movie and get the user rating from there
  const watchedMovieRating = watched.find(
    (movie) => movie.imdbID === selected
  )?.userRating;

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

  // effect to load movie details
  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selected}`
      );

      const data = await res.json();

      setMovie(data);
      setIsLoading(false);
    }

    getMovieDetails();
  }, [selected]);

  // effect to change document title
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    // clean up function.
    // this clean up function is executed when a previous component is unmounted.
    return () => (document.title = "usePopCorn");
  }, [title]);

  // make escape key close movie details when pressed.
  useEffect(() => {
    function closeMovieDetails(e) {
      if (e.code === "Escape") onCloseMovie();
    }

    document.addEventListener("keydown", closeMovieDetails);

    return () => {
      document.removeEventListener("keydown", closeMovieDetails);
    };
  }, [onCloseMovie]);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selected,
      title,
      poster,
      runtime: runtime == "N/A" ? "0" : runtime.split(" ").at(0),
      imdbRating,
      year,
      userRating: (userRating || imdbRating).toFixed(1),
    };

    onAddMovie(newWatchedMovie);
    onCloseMovie();
  }

  return (
    <div className={`details ${isLoading && "centered"}`}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
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
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    defaultRating={userRating || Math.ceil(Number(imdbRating))}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button
                      className="btn-add"
                      onClick={handleAdd}
                      disabled={isWatched}
                    >
                      + Add to Watched List
                    </button>
                  )}
                </>
              ) : (
                <p>✓ You rated this movie ⭐ {watchedMovieRating}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
