import { useRef, useEffect } from "react";

export default function Search({ query, onSearch, setQuery }) {
  const inputRef = useRef(null);

  useEffect(() => {
    function callback(e) {
      // check if any active element is equal to our input element

      if (document.activeElement === inputRef.current) return;

      if (e.code === "Enter") {
        inputRef.current.focus();
        setQuery("");
      }
    }

    document.addEventListener("keydown", callback);

    // return () => document.removeEventListener("keydown", callback);
  }, [setQuery]);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSearch(e)}
      ref={inputRef}
    />
  );
}
