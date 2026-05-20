import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';

export default function EditPost() {
  const { id } = useParams();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ title: '', body: '', tags: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [error, setError]   = useState('');

  useEffect(() => {
    API.get(`/posts/${id}`).then((res) => {
      const { title, body, tags } = res.data;
      setForm({ title, body, tags: tags.join(', ') });
      setLoading(false);
    });
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        body:  form.body,
        tags:  form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      await API.put(`/posts/${id}`, payload);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return (
    <div className="flex gap-2 justify-center mt-32">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-8">
        <p className="text-xs font-semibold tracking-widest text-rose-600 uppercase mb-1">Editing</p>
        <h1 className="text-3xl font-black tracking-tight text-zinc-900">Update your post</h1>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-zinc-900 font-bold text-lg placeholder-zinc-300 focus:outline-none focus:border-rose-400 transition-colors"
        />
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          required
          rows={14}
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-700 leading-relaxed placeholder-zinc-300 focus:outline-none focus:border-rose-400 resize-none transition-colors"
        />
        <input
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm text-zinc-700 placeholder-zinc-300 focus:outline-none focus:border-rose-400 transition-colors"
        />

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-zinc-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-rose-600 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/posts/${id}`)}
            className="px-6 py-2.5 rounded-full text-sm font-semibold border border-zinc-200 text-zinc-600 hover:border-zinc-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}