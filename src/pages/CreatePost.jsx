import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

export default function CreatePost() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ title: '', body: '', tags: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) { navigate('/login'); return null; }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        body:  form.body,
        tags:  form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const res = await API.post('/posts', payload);
      navigate(`/posts/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post.');
    } finally {
      setLoading(false);
    }
  }

  const wordCount = form.body.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-rose-600 uppercase mb-1">New post</p>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Write something great</h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Post title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-zinc-900 font-bold text-lg placeholder-zinc-300 focus:outline-none focus:border-rose-400 transition-colors"
        />

        <div className="relative">
          <textarea
            name="body"
            placeholder="Write your post here..."
            value={form.body}
            onChange={handleChange}
            required
            rows={14}
            className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-700 leading-relaxed placeholder-zinc-300 focus:outline-none focus:border-rose-400 resize-none transition-colors"
          />
          <span className="absolute bottom-3 right-3 text-xs text-zinc-300">{wordCount} words</span>
        </div>

        <input
          name="tags"
          placeholder="Tags: react, nodejs, webdev  (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-700 placeholder-zinc-300 focus:outline-none focus:border-rose-400 transition-colors"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Publishing...' : 'Publish post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-2.5 rounded-full text-sm font-semibold border border-zinc-200 text-zinc-600 hover:border-zinc-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}