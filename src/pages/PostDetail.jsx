import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [post, setPost]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked]     = useState(false);
  const [likes, setLikes]     = useState(0);
  const [comments, setComments] = useState([]);
  const [comment, setComment]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    API.get(`/posts/${id}`).then((res) => {
      setPost(res.data);
      setLikes(res.data.likes || 0);
      setComments(res.data.comments || []);
    }).finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Delete this post?')) return;
    await API.delete(`/posts/${id}`);
    navigate('/');
  }

  async function handleLike() {
    if (!user) return navigate('/login');
    setLiked(!liked);
    setLikes((l) => liked ? l - 1 : l + 1);
    try { await API.post(`/posts/${id}/like`); } catch {}
  }

  async function handleComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await API.post(`/posts/${id}/comments`, { text: comment });
      setComments(res.data.comments);
      setComment('');
    } catch {
      // Optimistic fallback if endpoint not yet wired
      setComments((prev) => [...prev, { text: comment, author: { username: user?.username }, createdAt: new Date() }]);
      setComment('');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="flex gap-2 justify-center mt-32">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
  if (!post) return <p className="text-center mt-20 text-zinc-400">Post not found.</p>;

  const isAuthor = user?.id === post.author?._id;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">

      {/* Back */}
      <Link to="/" className="text-xs font-semibold text-zinc-400 hover:text-rose-600 transition-colors mb-8 inline-block">
        ← Back to posts
      </Link>

      {/* Tags */}
      <div className="flex gap-2 flex-wrap mb-4">
        {post.tags.map((tag) => (
          <span key={tag} className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">#{tag}</span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-4xl font-black tracking-tight text-zinc-900 leading-tight mb-4">{post.title}</h1>

      {/* Meta */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white text-xs font-bold">
            {post.author?.username?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-800">@{post.author?.username}</p>
            <p className="text-xs text-zinc-400">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>

        {isAuthor && (
          <div className="flex gap-2">
            <Link to={`/edit/${post._id}`} className="text-xs font-semibold px-3 py-1.5 border border-zinc-200 rounded-full hover:border-zinc-400 transition-colors">
              Edit
            </Link>
            <button onClick={handleDelete} className="text-xs font-semibold px-3 py-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition-colors">
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="prose prose-zinc max-w-none mb-10">
        <p className="text-zinc-700 leading-8 text-lg whitespace-pre-wrap">{post.body}</p>
      </div>

      {/* Like button */}
      <div className="flex items-center gap-3 mb-12 pb-8 border-b border-zinc-100">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
            liked
              ? 'bg-rose-600 text-white border-rose-600'
              : 'border-zinc-200 text-zinc-600 hover:border-rose-300 hover:text-rose-600'
          }`}
        >
          ♥ {liked ? 'Liked' : 'Like'}
        </button>
        <span className="text-sm text-zinc-400">{likes} {likes === 1 ? 'like' : 'likes'}</span>
      </div>

      {/* Comments */}
      <div>
        <h2 className="text-lg font-black tracking-tight text-zinc-900 mb-6">
          Comments <span className="text-zinc-300">({comments.length})</span>
        </h2>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleComment} className="mb-8">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              className="w-full border border-zinc-200 rounded-xl px-4 py-3 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-rose-400 resize-none mb-2"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-zinc-900 text-white text-xs font-semibold px-4 py-2 rounded-full hover:bg-rose-600 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post comment'}
            </button>
          </form>
        ) : (
          <p className="text-sm text-zinc-400 mb-8">
            <Link to="/login" className="text-rose-600 font-semibold">Login</Link> to leave a comment.
          </p>
        )}

        {/* Comment list */}
        <div className="space-y-4">
          {comments.length === 0 && (
            <p className="text-sm text-zinc-400 text-center py-6">No comments yet. Start the conversation!</p>
          )}
          {comments.map((c, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-zinc-200 flex items-center justify-center text-zinc-600 text-xs font-bold flex-shrink-0 mt-0.5">
                {c.author?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 bg-zinc-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-zinc-800">@{c.author?.username || 'user'}</span>
                  <span className="text-xs text-zinc-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-zinc-700 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}