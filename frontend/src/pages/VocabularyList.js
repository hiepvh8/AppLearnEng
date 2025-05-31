import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid, TrashIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../contexts/AuthContext';

function VocabularyList() {
  const [vocabularies, setVocabularies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const [vocabResponse, categoriesResponse, favoritesResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/vocab/vocabularies', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/vocab/categories', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8000/api/vocab/favorites', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setVocabularies(vocabResponse.data);
        setCategories(categoriesResponse.data);
        setFavorites(favoritesResponse.data.map(fav => fav.id));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8000/api/vocab/vocabularies?category=${category}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setVocabularies(response.data);
    } catch (error) {
      console.error('Error fetching vocabularies:', error);
      setError('Không thể tải từ vựng');
    }
  };

  const toggleFavorite = async (vocabularyId) => {
    try {
      const token = localStorage.getItem('token');
      const isFavorite = favorites.includes(vocabularyId);

      if (isFavorite) {
        await axios.delete(`http://localhost:8000/api/vocab/favorites/${vocabularyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(id => id !== vocabularyId));
      } else {
        await axios.post(`http://localhost:8000/api/vocab/favorites/${vocabularyId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites([...favorites, vocabularyId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setError('Không thể cập nhật yêu thích');
    }
  };

  const handleDelete = async (vocabularyId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa từ vựng này không?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8000/api/vocab/${vocabularyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVocabularies(vocabularies.filter(v => v.id !== vocabularyId));
      setFavorites(favorites.filter(id => id !== vocabularyId));
    } catch (error) {
      console.error('Error deleting vocabulary:', error);
      setError('Không thể xóa từ vựng');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Danh sách từ vựng</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryChange('')}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === ''
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tất cả
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-md ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vocabularies.map((vocabulary) => (
            <div
              key={vocabulary.id}
              className="bg-white overflow-hidden shadow rounded-lg relative"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-medium text-gray-900">
                    {vocabulary.word}
                  </h3>
                  <button
                    onClick={() => toggleFavorite(vocabulary.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    {favorites.includes(vocabulary.id) ? (
                      <HeartSolid className="h-6 w-6 text-red-500" />
                    ) : (
                      <HeartOutline className="h-6 w-6" />
                    )}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">{vocabulary.meaning}</p>
                <p className="mt-2 text-sm text-gray-500 italic">
                  {vocabulary.example}
                </p>
                <span className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                  {vocabulary.category}
                </span>
                <button
                  onClick={() => handleDelete(vocabulary.id)}
                  className="absolute bottom-3 right-3 text-gray-400 hover:text-red-600"
                  title="Xóa từ vựng"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VocabularyList; 