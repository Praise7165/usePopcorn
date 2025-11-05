import Search from "./Search";
import Logo from "./Logo";

/* Component composition using children to prevent or reduce prop drilling */

export default function Nav({ children, query, onSearch }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search query={query} onSearch={onSearch} />
      {children}
    </nav>
  );
}
