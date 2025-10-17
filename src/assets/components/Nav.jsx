import Search from "./Search";
import Logo from "./Logo";
import ResultCount from "./ResultCount";

export default function Nav({ movies }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search />
      <ResultCount movies={movies} />
    </nav>
  );
}
