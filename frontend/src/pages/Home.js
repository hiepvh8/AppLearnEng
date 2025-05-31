import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpenIcon, HeartIcon, ClockIcon } from '@heroicons/react/24/outline';

function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Học từ vựng tiếng Anh</span>
          <span className="block text-primary-600">Hiệu quả và thú vị</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Ứng dụng học từ vựng tiếng Anh với các tính năng hiện đại, giúp bạn học tập hiệu quả hơn.
        </p>
      </div>

      <div className="mt-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                    <BookOpenIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Flashcard</h3>
                <p className="mt-5 text-base text-gray-500">
                  Học từ vựng qua flashcard với giao diện trực quan, dễ nhớ.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                    <HeartIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Từ yêu thích</h3>
                <p className="mt-5 text-base text-gray-500">
                  Lưu lại các từ vựng yêu thích để ôn tập sau này.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div>
                  <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                    <ClockIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Nhắc nhở học tập</h3>
                <p className="mt-5 text-base text-gray-500">
                  Nhắc nhở học từ vựng hàng ngày để duy trì thói quen học tập.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/vocabulary"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Bắt đầu học ngay
        </Link>
      </div>
    </div>
  );
}

export default Home; 