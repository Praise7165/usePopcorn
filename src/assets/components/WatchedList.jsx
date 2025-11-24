import { useState } from "react";
export default function WatchedList({ watched, onDelete }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function Movie({ movie, onDelete }) {
  const [slide, setSlide] = useState(false);

  return (
    <li className={`${slide && "watched"}`}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => {
            setSlide(true);
            setTimeout(() => onDelete(movie.imdbID), 300);
          }}
        >
          X
        </button>
      </div>
    </li>
  );
}
