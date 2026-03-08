import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function CreatePost() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [imageString, setImageString] = useState<string | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setImageString(typeof result === 'string' ? result : null);
    };
    reader.readAsDataURL(file);
  };

  const submitPost = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    await api.post('/posts', { userId: Number(userId), content, imageUrl: imageString ?? undefined });
    navigate('/feed');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New Connection Post</h1>
        <p className="mt-1 text-gray-600">Share a success story or announce your new venture</p>
        <div className="mt-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full min-h-[160px] rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="mt-4">
            <input type="file" accept="image/*" onChange={handleImageSelect} className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-600 hover:file:bg-blue-100" />
          </div>
          {imageString != null && (
            <div className="mt-4">
              <img src={imageString} alt="Preview" className="max-h-48 rounded-lg border border-gray-200 object-contain" />
            </div>
          )}
          <div className="mt-6 flex gap-4">
            <button
              onClick={submitPost}
              className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-500"
            >
              Publish to NEFRA
            </button>
            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
