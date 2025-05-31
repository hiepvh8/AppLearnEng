import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';

function Favorites() {
  const [favoriteVocabularies, setFavoriteVocabularies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFavoriteVocabularies();
  }, []);

  const fetchFavoriteVocabularies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/vocab/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavoriteVocabularies(response.data);
    } catch (error) {
      setError('Không thể tải danh sách yêu thích');
      setFavoriteVocabularies([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Đang tải...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600">{error}</h2>
      </div>
    );
  }

  if (favoriteVocabularies.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Chưa có từ vựng yêu thích nào</h2>
        <p className="mt-4 text-gray-600">
          Hãy thêm từ vựng vào danh sách yêu thích để xem chúng ở đây
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Từ vựng yêu thích</h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {favoriteVocabularies.map((vocab) => (
          <div
            key={vocab.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900">{vocab.word}</h3>
              <span className="text-primary-500">
                <HeartSolid className="h-6 w-6" />
              </span>
            </div>
            <p className="mt-2 text-gray-600">{vocab.meaning}</p>
            <p className="mt-4 text-sm text-gray-500 italic">"{vocab.example}"</p>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {vocab.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Favorites; 