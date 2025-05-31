import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-primary-600">
                VocabLearn
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
              >
                <HomeIcon className="h-5 w-5 mr-1" />
                Home
              </Link>
              {user && (
                <>
                  <Link
                    to="/vocabulary"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <BookOpenIcon className="h-5 w-5 mr-1" />
                    Vocabulary
                  </Link>
                  <Link
                    to="/vocabulary/add"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                  >
                    <BookOpenIcon className="h-5 w-5 mr-1" />
                    Thêm từ vựng
                  </Link>
                </>
              )}
              <Link
                to="/flashcard"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                <BookOpenIcon className="h-5 w-5 mr-1" />
                Flashcard
              </Link>
              <Link
                to="/favorites"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                <HeartIcon className="h-5 w-5 mr-1" />
                Favorites
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  <UserIcon className="h-5 w-5 mr-1" />
                  {user.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <UserIcon className="h-5 w-5 mr-1" />
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <UserIcon className="h-5 w-5 mr-1" />
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 