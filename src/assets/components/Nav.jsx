import Search from "./Search";
import Logo from "./Logo";

/* Component composition using children to prevent or reduce prop drilling */

export default function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search />
      {children}
    </nav>
  );
}
