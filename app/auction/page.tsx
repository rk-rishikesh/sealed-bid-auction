'use client';
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from './header';

// Mock data for news items
const newsItems = [
  {
    id: 1,
    title: 'Item',
    date: 'August 02, 2025',
  },
  {
    id: 2,
    title: 'Item',
    date: 'May 28, 2025',
  },
  {
    id: 3,
    title: 'Item',
    date: 'May 26, 2025',
  },
  {
    id: 4,
    title: 'Item',
    date: 'May 26, 2025',
  },
  {
    id: 5,
    title: 'Item',
    date: 'May 20, 2025',
  },
  {
    id: 6,
    title: 'Item',
    date: 'May 18, 2025',
  },
];

const AuctionPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white-pattern font-sans">
      {/* Header */}
      <Header />
      <header className="pt-24 max-w-7xl mx-auto px-4 pb-20">
        <h1 className="text-5xl sm:text-6xl font-funnel-display font-light text-gray-900">
          Ongoing <span className="font-bold">Auctions</span>
        </h1>
      </header>

      {/* Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {newsItems.map((item) => {
            // Determine status based on date
            const auctionDate = new Date(item.date);
            const today = new Date();
            // Set time to 0:0:0 for comparison
            auctionDate.setHours(0,0,0,0);
            today.setHours(0,0,0,0);
            const isBidding = auctionDate >= today;
            return (
              <div key={item.id} className="flex h-40 bg-white border border-gray-200 overflow-hidden shadow-sm">
                {/* Image */}
                <div className="flex-shrink-0 w-40 h-40 bg-gray-100 flex items-center justify-center">
                  <img
                    src={item.id % 2 === 0 ? '/assets/images/dark.jpg' : '/assets/images/light.jpg'}
                    alt="Auction visual"
                    className="object-contain w-40 h-40"
                  />
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col justify-between p-6 relative">
                  <div>
                    <div className="font-bold text-lg text-gray-900 mb-2 font-funnel-display">{item.title}</div>
                    <div className="text-gray-500 text-sm mb-2 font-funnel-display">
                      Date: {item.date}
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => isBidding && router.push(`/auction/${item.id}`)}
                      disabled={!isBidding}
                      className={`inline-flex items-center justify-center w-full px-4 py-2 border border-gray-300 text-base font-funnel-display text-gray-900 transition-colors bg-white ${isBidding ? 'hover:border-gray-400 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                    >
                      {isBidding ? 'Bid' : 'Closed'}
                      {isBidding && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-5 h-5 ml-2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.25 6.75V17.25M17.25 6.75H6.75M17.25 6.75L6.75 17.25"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AuctionPage;