import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function Flashcard() {
  const [vocabularies, setVocabularies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchVocabularies();
    fetchFavorites();
  }, [selectedCategory]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/vocab/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchVocabularies = async () => {
    try {
      const url = selectedCategory
        ? `http://localhost:8000/api/vocab/vocabularies?category=${selectedCategory}`
        : 'http://localhost:8000/api/vocab/vocabularies';
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setVocabularies(response.data);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (error) {
      console.error('Error fetching vocabularies:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/vocab/favorites', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setFavorites(response.data.map(fav => fav.id));
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (vocabId) => {
    try {
      const token = localStorage.getItem('token');
      const isFavorite = favorites.includes(vocabId);
      if (isFavorite) {
        await axios.delete(`http://localhost:8000/api/vocab/favorites/${vocabId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(favorites.filter(id => id !== vocabId));
      } else {
        await axios.post(`http://localhost:8000/api/vocab/favorites/${vocabId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites([...favorites, vocabId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const nextCard = () => {
    if (currentIndex < vocabularies.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  if (vocabularies.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Không có từ vựng nào</h2>
      </div>
    );
  }

  const currentVocab = vocabularies[currentIndex];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Flashcard</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full ${
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
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
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

      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative w-full max-w-2xl">
          <div
            className={`bg-white rounded-lg shadow-xl p-8 cursor-pointer transform transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div className="text-center">
              {isFlipped ? (
                <div
                  style={{
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <div className="flex justify-between items-start w-full mb-4">
                    <span className="text-sm text-gray-500">
                      {currentIndex + 1} / {vocabularies.length}
                    </span>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await toggleFavorite(currentVocab.id);
                      }}
                      className="text-gray-400 hover:text-primary-500"
                    >
                      {favorites.includes(currentVocab.id) ? (
                        <HeartSolid className="h-6 w-6 text-primary-500" />
                      ) : (
                        <HeartOutline className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {currentVocab.meaning}
                  </h3>
                  <div className="mt-4">
                    <p className="text-gray-600 italic">"{currentVocab.example}"</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-4">
                      {currentVocab.category}
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-sm text-gray-500">
                      {currentIndex + 1} / {vocabularies.length}
                    </span>
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        await toggleFavorite(currentVocab.id);
                      }}
                      className="text-gray-400 hover:text-primary-500"
                    >
                      {favorites.includes(currentVocab.id) ? (
                        <HeartSolid className="h-6 w-6 text-primary-500" />
                      ) : (
                        <HeartOutline className="h-6 w-6" />
                      )}
                    </button>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {currentVocab.word}
                  </h3>
                </>
              )}
              {isFlipped && (
                <></>
              )}
            </div>
          </div>

          <div className="flex justify-between mt-8">
            <button
              onClick={previousCard}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full ${
                currentIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary-600 hover:bg-primary-100'
              }`}
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
            <button
              onClick={nextCard}
              disabled={currentIndex === vocabularies.length - 1}
              className={`p-2 rounded-full ${
                currentIndex === vocabularies.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-primary-600 hover:bg-primary-100'
              }`}
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Flashcard; 