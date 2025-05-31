import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

function AddVocabulary() {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token');
      }

      await axios.post(
        'http://localhost:8000/api/vocab/vocabularies',
        {
          word,
          meaning,
          example,
          category,
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      navigate('/vocabulary');
    } catch (error) {
      console.error('Error adding vocabulary:', error);
      setError(error.response?.data?.detail || 'Không thể thêm từ vựng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thêm từ vựng mới</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="word" className="block text-sm font-medium text-gray-700">
              Từ vựng
            </label>
            <input
              type="text"
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="meaning" className="block text-sm font-medium text-gray-700">
              Nghĩa
            </label>
            <textarea
              id="meaning"
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="example" className="block text-sm font-medium text-gray-700">
              Ví dụ
            </label>
            <textarea
              id="example"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Danh mục
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/vocabulary')}
              className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              disabled={loading}
            >
              {loading ? 'Đang thêm...' : 'Thêm từ vựng'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddVocabulary; 