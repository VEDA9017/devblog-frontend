import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="text-xl font-black tracking-tighter text-zinc-900 hover:text-rose-600 transition-colors">
          dev<span className="text-rose-600">blog</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm font-medium">
          {user ? (
            <>
              <span className="text-zinc-400">@{user.username}</span>
              <Link
                to="/create"
                className="bg-zinc-900 text-white px-4 py-1.5 rounded-full hover:bg-rose-600 transition-colors text-xs font-semibold tracking-wide"
              >
                + New Post
              </Link>
              <button
                onClick={handleLogout}
                className="text-zinc-500 hover:text-rose-600 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-zinc-600 hover:text-zinc-900 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-zinc-900 text-white px-4 py-1.5 rounded-full hover:bg-rose-600 transition-colors text-xs font-semibold tracking-wide"
              >
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}