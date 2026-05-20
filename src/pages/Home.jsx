import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';

export default function Home() {
  const [posts, setPosts]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    const url = activeTag ? `/posts?tag=${activeTag}` : '/posts';
    API.get(url)
      .then((res) => {
        setPosts(res.data);
        // Collect unique tags from all posts for the filter bar
        const tags = [...new Set(res.data.flatMap((p) => p.tags))];
        if (!activeTag) setAllTags(tags);
      })
      .catch(() => setError('Failed to load posts.'))
      .finally(() => setLoading(false));
  }, [activeTag]);

  const [featured, ...rest] = posts;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">

      {/* Hero header */}
      <div className="mb-10 border-b border-zinc-200 pb-8">
        <p className="text-xs font-semibold tracking-widest text-rose-600 uppercase mb-2">Developer community</p>
        <h1 className="text-4xl font-black tracking-tighter text-zinc-900 leading-tight">
          Ideas worth<br />reading.
        </h1>
      </div>

      {/* Tag filter */}
      {allTags.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setActiveTag('')}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
              !activeTag
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                activeTag === tag
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="flex gap-3 mt-16 justify-center">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      )}

      {error && <p className="text-rose-600 text-sm">{error}</p>}

      {!loading && posts.length === 0 && (
        <div className="text-center py-20 text-zinc-400">
          <p className="text-5xl mb-4">✍️</p>
          <p className="font-medium">No posts yet. Be the first to write one!</p>
        </div>
      )}

      {/* Featured post */}
      {featured && (
        <Link to={`/posts/${featured._id}`} className="group block mb-8">
          <div className="border border-zinc-200 rounded-2xl p-8 hover:border-rose-300 hover:shadow-lg transition-all bg-gradient-to-br from-zinc-50 to-white">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-rose-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Featured</span>
              {featured.tags.slice(0, 2).map((t) => (
                <span key={t} className="text-xs text-zinc-500 font-medium">#{t}</span>
              ))}
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-900 group-hover:text-rose-600 transition-colors mb-3 leading-snug">
              {featured.title}
            </h2>
            <p className="text-zinc-500 leading-relaxed line-clamp-2 mb-4">{featured.body}</p>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-600">@{featured.author?.username}</span>
              <span>·</span>
              <span>{new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </Link>
      )}

      {/* Post grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {rest.map((post) => (
          <Link key={post._id} to={`/posts/${post._id}`} className="group block">
            <div className="border border-zinc-200 rounded-xl p-6 hover:border-rose-300 hover:shadow-md transition-all h-full">
              <div className="flex gap-2 mb-3 flex-wrap">
                {post.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-xs text-rose-600 font-semibold">#{t}</span>
                ))}
              </div>
              <h3 className="font-black text-zinc-900 tracking-tight leading-snug group-hover:text-rose-600 transition-colors mb-2">
                {post.title}
              </h3>
              <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed mb-4">{post.body}</p>
              <div className="flex items-center gap-2 text-xs text-zinc-400 mt-auto">
                <span className="font-semibold text-zinc-500">@{post.author?.username}</span>
                <span>·</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}